#!/usr/bin/env python3
"""EEP Workflow V2: orquestrador local seguro para a máquina editorial do EEP."""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Sequence

BASE_URL = "https://www.estudioescritaplanejada.com.br"
EXPECTED_ACCOUNT = "estudioescritaplanejada-creator"
EXPECTED_REMOTE = "github.com/estudioescritaplanejada-creator/site"
EXPECTED_BRANCH = "main"
ARTICLE_DIR = Path("src/content/articles")
IMAGE_DIR = Path("public/assets/editorial")
CATEGORIES = {
    "protecao-digital",
    "decisoes-digitais",
    "rotina-digital",
    "ferramentas-e-ia",
    "produtos-digitais",
}

class FlowError(RuntimeError):
    pass


def stamp():
    return dt.datetime.now().strftime("%Y%m%d-%H%M%S")


def project_root():
    return Path(__file__).resolve().parent.parent


def work_root():
    root = project_root() / ".eep-work"
    for name in ("inbox", "logs", "archive"):
        (root / name).mkdir(parents=True, exist_ok=True)
    return root


def work_logs():
    return work_root() / "logs"


class Log:
    def __init__(self, action):
        self.path = work_logs() / f"eep-work-{action}-{stamp()}.txt"
        self.f = self.path.open("w", encoding="utf-8")
    def write(self, s=""):
        print(s)
        self.f.write(s + "\n")
        self.f.flush()
    def close(self):
        self.f.close()


def cmd_out(cmd: Sequence[str], cwd: Path):
    p = subprocess.run(list(cmd), cwd=cwd, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    if p.returncode:
        raise FlowError(f"Falhou: {' '.join(cmd)}\n{p.stdout}")
    return p.stdout.strip()


def run_to_file(cmd: Sequence[str], cwd: Path, path: Path):
    with path.open("w", encoding="utf-8") as f:
        p = subprocess.run(list(cmd), cwd=cwd, text=True, stdout=f, stderr=subprocess.STDOUT)
    return p.returncode


def tail(path: Path, n=35):
    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    return "\n".join(lines[-n:])


def repo_ok(repo: Path):
    repo = repo.expanduser().resolve()
    for p in [repo / ".git", repo / "package.json", repo / ARTICLE_DIR]:
        if not p.exists():
            raise FlowError(f"Estrutura esperada não encontrada: {p}")
    return repo


def repo_identity(repo: Path):
    branch = cmd_out(["git", "branch", "--show-current"], repo)
    remote = cmd_out(["git", "remote", "get-url", "origin"], repo)
    if branch != EXPECTED_BRANCH:
        raise FlowError(f"Branch inesperada: {branch}; esperado {EXPECTED_BRANCH}")
    if EXPECTED_REMOTE not in remote:
        raise FlowError(f"Remote inesperado: {remote}")


def status(repo: Path):
    s = cmd_out(["git", "status", "--porcelain"], repo)
    return [x for x in s.splitlines() if x.strip()]


def clean(repo: Path):
    s = status(repo)
    if s:
        raise FlowError("Repo não está limpo:\n" + "\n".join(s))


def frontmatter_lines(text: str):
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        raise FlowError("Frontmatter não inicia com ---")
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return lines, i
    raise FlowError("Frontmatter sem fechamento ---")


def scalar(text: str, key: str):
    lines, end = frontmatter_lines(text)
    rx = re.compile(rf"^{re.escape(key)}:\s*(.*)$")
    for line in lines[1:end]:
        m = rx.match(line)
        if m:
            v = m.group(1).strip()
            if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
                v = v[1:-1]
            return v
    return None


def has_key(text: str, key: str):
    lines, end = frontmatter_lines(text)
    return any(re.match(rf"^{re.escape(key)}:", x) for x in lines[1:end])


def set_scalar(text: str, key: str, value: str, quote=True):
    lines, end = frontmatter_lines(text)
    rendered = json.dumps(value, ensure_ascii=False) if quote else value
    rx = re.compile(rf"^{re.escape(key)}:")
    for i in range(1, end):
        if rx.match(lines[i]):
            lines[i] = f"{key}: {rendered}"
            return "\n".join(lines) + "\n"
    lines.insert(end, f"{key}: {rendered}")
    return "\n".join(lines) + "\n"


def validate_source(text: str, path: Path):
    if "—" in text:
        raise FlowError(f"Travessão encontrado em {path}")
    if not scalar(text, "title") or "Substitua por" in scalar(text, "title"):
        raise FlowError(f"Título inválido em {path}")
    if scalar(text, "category") not in CATEGORIES:
        raise FlowError(f"Categoria inválida em {path}: {scalar(text, 'category')}")
    if scalar(text, "draft") != "true":
        raise FlowError(f"Fonte precisa estar draft:true: {path}")
    if not has_key(text, "video"):
        raise FlowError(f"Bloco video ausente em {path}")


def image_backend():
    try:
        import PIL  # noqa
        return "pillow"
    except Exception:
        pass
    for x in ["magick", "convert", "ffmpeg"]:
        if shutil.which(x):
            return x
    return None


def convert_image(src: Path, dst: Path, log: Log):
    src = src.expanduser().resolve()
    if not src.is_file():
        raise FlowError(f"Imagem não encontrada: {src}")
    dst.parent.mkdir(parents=True, exist_ok=True)
    backend = image_backend()
    if not backend:
        raise FlowError("Sem backend de imagem. Precisa de Pillow, ImageMagick ou ffmpeg.")
    log.write(f"backend de imagem: {backend}")
    if backend == "pillow":
        from PIL import Image, ImageOps
        with Image.open(src) as im:
            im = im.convert("RGB")
            im = ImageOps.fit(im, (1600, 1200), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
            im.save(dst, "WEBP", quality=88, method=6)
    elif backend in {"magick", "convert"}:
        p = subprocess.run([
            shutil.which(backend) or backend, str(src), "-auto-orient", "-resize", "1600x1200^",
            "-gravity", "center", "-extent", "1600x1200", "-quality", "88", str(dst)
        ], text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        if p.returncode:
            raise FlowError("Conversão falhou:\n" + p.stdout)
    else:
        p = subprocess.run([
            shutil.which("ffmpeg") or "ffmpeg", "-y", "-i", str(src),
            "-vf", "scale=1600:1200:force_original_aspect_ratio=increase,crop=1600:1200",
            "-frames:v", "1", "-c:v", "libwebp", "-quality", "88", str(dst)
        ], text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        if p.returncode:
            raise FlowError("Conversão falhou:\n" + p.stdout)
    if not dst.is_file() or dst.stat().st_size == 0:
        raise FlowError(f"WebP não produzido: {dst}")

    # O fluxo atual do EEP exige exatamente 1600 x 1200.
    try:
        from PIL import Image
        with Image.open(dst) as check:
            if check.size != (1600, 1200):
                raise FlowError(
                    f"Imagem final inválida: {check.size[0]}x{check.size[1]}; "
                    "esperado 1600x1200"
                )
            if (check.format or "").upper() != "WEBP":
                raise FlowError(f"Formato final inválido: {check.format}; esperado WEBP")
    except ImportError:
        identify = shutil.which("identify")
        if identify:
            info = subprocess.run(
                [identify, "-format", "%m %wx%h", str(dst)],
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
            )
            if info.returncode or info.stdout.strip().upper() != "WEBP 1600X1200":
                raise FlowError(
                    f"Não foi possível confirmar WebP 1600x1200: {info.stdout.strip()}"
                )

    log.write(f"imagem pronta: {dst} | WEBP 1600x1200")


def gh_active(repo: Path):
    if not shutil.which("gh"):
        return None
    p = subprocess.run(["gh", "auth", "status"], cwd=repo, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    blocks = re.split(r"\n(?=\s*✓ Logged in to github\.com account)", p.stdout or "")
    for b in blocks:
        if "Active account: true" in b:
            m = re.search(r"account\s+([^\s(]+)", b)
            if m:
                return m.group(1)
    return None


def expected(repo: Path, slug: str):
    return repo / ARTICLE_DIR / f"{slug}.md", repo / IMAGE_DIR / f"{slug}.webp"


def inspect_dist(repo: Path, slug: str, log: Log):
    html = repo / "dist" / "guias" / slug / "index.html"
    if not html.is_file():
        raise FlowError(f"HTML não encontrado: {html}")
    h = html.read_text(encoding="utf-8", errors="replace")
    md = (repo / ARTICLE_DIR / f"{slug}.md").read_text(encoding="utf-8")
    canonical = f"{BASE_URL}/guias/{slug}/"
    checks = {
        "canonical": canonical in h,
        "Article": "Article" in h,
        "BreadcrumbList": "BreadcrumbList" in h,
        "image": bool(scalar(md, "image") and scalar(md, "image") in h),
    }
    vm = re.search(r"(?ms)^video:\s*\n(?:^[ \t].*\n)*?^[ \t]+id:\s*[\"']?([^\"'\n]+)", md)
    checks["video"] = bool(vm and vm.group(1).strip() in h)
    for k, v in checks.items():
        log.write(f"- {k}: {'OK' if v else 'FALHA'}")
        if not v:
            raise FlowError(f"Falha na inspeção dist: {k}")
    sm = [p for p in (repo / "dist").glob("sitemap*.xml") if slug in p.read_text(encoding="utf-8", errors="replace")]
    if not sm:
        raise FlowError("URL não encontrada no sitemap")
    log.write(f"- sitemap: OK ({', '.join(p.name for p in sm)})")


def wait_200(url: str, log: Log, attempts: int, interval: int):
    for i in range(1, attempts + 1):
        code = None
        try:
            r = urllib.request.Request(url, headers={"User-Agent": "EEP-Workflow-V2/1.0"})
            with urllib.request.urlopen(r, timeout=20) as resp:
                code = resp.getcode()
        except urllib.error.HTTPError as e:
            code = e.code
        except Exception as e:
            log.write(f"tentativa {i}: erro {e}")
        if code is not None:
            log.write(f"tentativa {i}: HTTP {code}")
        if code == 200:
            return True
        if i < attempts:
            time.sleep(interval)
    return False


def do_doctor(args):
    log = Log("doctor")
    try:
        repo = repo_ok(Path(args.repo))
        log.write("=== EEP WORKFLOW V2 / DOCTOR ===")
        log.write(f"repo: {repo}")
        log.write(f"branch: {cmd_out(['git','branch','--show-current'], repo)}")
        log.write(f"remote: {cmd_out(['git','remote','get-url','origin'], repo)}")
        log.write(f"HEAD: {cmd_out(['git','log','-1','--oneline'], repo)}")
        log.write("status: " + (" | ".join(status(repo)) if status(repo) else "limpo"))
        log.write(f"python: {sys.version.split()[0]}")
        for x in ["node", "npm", "git", "gh", "magick", "convert", "ffmpeg"]:
            log.write(f"{x}: {shutil.which(x) or 'ausente'}")
        log.write(f"backend imagem: {image_backend() or 'ausente'}")
        log.write(f"workspace local: {work_root()}")
        log.write(f"conta GitHub ativa: {gh_active(repo) or 'não detectada'}")

        try:
            pkg = json.loads((repo / "package.json").read_text(encoding="utf-8"))
            scripts = pkg.get("scripts", {})
            for name in ["eep:new", "eep:check", "eep:publish", "eep:verify", "eep:audit"]:
                log.write(f"script {name}: {'OK' if name in scripts else 'AUSENTE'}")
        except Exception as e:
            log.write(f"scripts npm: não foi possível verificar ({e})")

        log.write(f"TXT: {log.path}")
        return 0
    except Exception as e:
        log.write(f"ERRO: {e}")
        log.write(f"TXT: {log.path}")
        return 1
    finally:
        log.close()


def do_prepare(args):
    log = Log("prepare")
    try:
        repo = repo_ok(Path(args.repo)); repo_identity(repo); clean(repo)
        if len(args.article) != len(args.image):
            raise FlowError("Use a mesma quantidade de --article e --image, na mesma ordem.")
        alts = {}
        for item in args.image_alt or []:
            if "=" not in item:
                raise FlowError("--image-alt deve usar slug=texto")
            k, v = item.split("=", 1); alts[k.strip()] = v.strip()
        slugs = [Path(x).stem for x in args.article]
        if len(set(slugs)) != len(slugs):
            raise FlowError("Slugs duplicados no lote")
        for slug in slugs:
            md, img = expected(repo, slug)
            if md.exists() or img.exists():
                raise FlowError(f"Destino já existe para {slug}; não sobrescrevo automaticamente.")
        log.write("=== EEP WORKFLOW V2 / PREPARE ===")
        for a, im, slug in zip(args.article, args.image, slugs):
            src_md = Path(a).expanduser().resolve(); src_img = Path(im).expanduser().resolve()
            if not src_md.is_file():
                raise FlowError(f"Markdown não encontrado: {src_md}")
            text = src_md.read_text(encoding="utf-8"); validate_source(text, src_md)
            alt = alts.get(slug) or scalar(text, "imageAlt")
            if not alt:
                raise FlowError(f"imageAlt ausente para {slug}")
            dst_md, dst_img = expected(repo, slug)
            convert_image(src_img, dst_img, log)
            text = set_scalar(text, "image", f"/assets/editorial/{slug}.webp")
            text = set_scalar(text, "imageAlt", alt)
            dst_md.write_text(text, encoding="utf-8")
            log.write(f"artigo: {dst_md}")
            log.write(f"imagem: {dst_img}")
        checklog = work_logs() / f"eep-work-check-{stamp()}.txt"
        rc = run_to_file(["npm", "run", "eep:check"], repo, checklog)
        log.write(f"eep:check = {rc}")
        log.write(f"log completo: {checklog}")
        log.write(tail(checklog, 35))
        if rc:
            raise FlowError("eep:check falhou")
        p = subprocess.run(["git", "diff", "--check"], cwd=repo, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        log.write(f"git diff --check = {p.returncode}")
        if p.stdout.strip(): log.write(p.stdout.strip())
        if p.returncode: raise FlowError("git diff --check falhou")
        log.write("status:")
        for x in status(repo): log.write(x)
        log.write(f"PREPARE OK. TXT: {log.path}")
        log.write("Nenhum commit ou push foi executado.")
        return 0
    except Exception as e:
        log.write(f"ERRO: {e}")
        log.write(f"TXT: {log.path}")
        return 1
    finally:
        log.close()


def do_release(args):
    log = Log("release")
    snapshots = {}
    commit_created = False
    push_done = False
    try:
        repo = repo_ok(Path(args.repo))
        repo_identity(repo)
        slugs = args.slug

        # Segurança operacional: confirme a conta antes de qualquer mutação editorial.
        account = gh_active(repo)
        log.write("=== EEP WORKFLOW V2 / RELEASE ===")
        log.write(f"conta GitHub ativa: {account}")
        if account != EXPECTED_ACCOUNT:
            raise FlowError(
                f"Conta GitHub ativa incorreta: {account}; esperado {EXPECTED_ACCOUNT}. "
                "Nenhum eep:publish, commit ou push foi executado."
            )

        # Segurança contra publicar sobre uma main local desatualizada.
        p = subprocess.run(
            ["git", "fetch", "origin", EXPECTED_BRANCH, "--quiet"],
            cwd=repo,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        if p.returncode:
            raise FlowError("git fetch falhou:\\n" + p.stdout)

        local_head = cmd_out(["git", "rev-parse", "HEAD"], repo)
        remote_head = cmd_out(["git", "rev-parse", f"origin/{EXPECTED_BRANCH}"], repo)
        if local_head != remote_head:
            raise FlowError(
                "HEAD local difere de origin/main. Sincronize o repositório antes do RELEASE. "
                "Nenhuma publicação foi iniciada."
            )

        allowed = set()
        for slug in slugs:
            md, img = expected(repo, slug)
            if not md.is_file() or not img.is_file():
                raise FlowError(f"Artigo/imagem ausente para {slug}")
            text_md = md.read_text(encoding="utf-8")
            if scalar(text_md, "draft") != "true":
                raise FlowError(f"{slug}: esperado draft:true antes do release")
            if not has_key(text_md, "video"):
                raise FlowError(f"{slug}: video ausente")
            if scalar(text_md, "image") != f"/assets/editorial/{slug}.webp":
                raise FlowError(f"{slug}: image do frontmatter não aponta para o WebP esperado")
            if not scalar(text_md, "imageAlt"):
                raise FlowError(f"{slug}: imageAlt ausente")
            snapshots[md] = text_md
            allowed.add(str(md.relative_to(repo)))
            allowed.add(str(img.relative_to(repo)))

        unexpected = []
        for line in status(repo):
            pth = line[3:].strip()
            if " -> " in pth or pth not in allowed:
                unexpected.append(line)
        if unexpected:
            raise FlowError("Alterações fora do lote:\\n" + "\\n".join(unexpected))

        p = subprocess.run(
            ["git", "diff", "--check"],
            cwd=repo,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        if p.returncode:
            raise FlowError("git diff --check falhou antes da publicação:\\n" + p.stdout)

        # Publicação local com rollback dos Markdown do lote se algum publish falhar.
        for slug in slugs:
            plog = work_logs() / f"eep-work-publish-{slug}-{stamp()}.txt"
            rc = run_to_file(["npm", "run", "eep:publish", "--", slug], repo, plog)
            log.write(f"{slug}: eep:publish = {rc}")
            log.write(f"log: {plog}")
            log.write(tail(plog, 25))
            if rc:
                for md, original in snapshots.items():
                    md.write_text(original, encoding="utf-8")
                raise FlowError(
                    f"eep:publish falhou para {slug}. "
                    "Os Markdown do lote foram restaurados para draft:true."
                )

        for slug in slugs:
            md, _ = expected(repo, slug)
            if scalar(md.read_text(encoding="utf-8"), "draft") != "false":
                for restore_md, original in snapshots.items():
                    restore_md.write_text(original, encoding="utf-8")
                raise FlowError(
                    f"{slug}: eep:publish terminou sem deixar draft:false. "
                    "Markdown do lote restaurado."
                )

        for slug in slugs:
            log.write(f"inspeção dist: {slug}")
            inspect_dist(repo, slug, log)

        files = sorted(allowed)
        p = subprocess.run(
            ["git", "add", "--", *files],
            cwd=repo,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        if p.returncode:
            raise FlowError("git add falhou:\\n" + p.stdout)

        p = subprocess.run(
            ["git", "diff", "--cached", "--check"],
            cwd=repo,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        if p.returncode:
            raise FlowError("git diff --cached --check falhou:\\n" + p.stdout)

        staged = cmd_out(["git", "diff", "--cached", "--name-only"], repo).splitlines()
        if set(staged) != set(files):
            raise FlowError(f"Stage inesperado. esperado={files} staged={staged}")

        message = args.message or (
            f"feat: publica {len(slugs)} conteúdos editoriais V2"
            if len(slugs) > 1
            else f"feat: publica guia {slugs[0]}"
        )
        p = subprocess.run(
            ["git", "commit", "-m", message],
            cwd=repo,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        log.write(p.stdout.rstrip())
        if p.returncode:
            raise FlowError("commit falhou")
        commit_created = True

        p = subprocess.run(
            ["git", "push", "origin", EXPECTED_BRANCH],
            cwd=repo,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        log.write(p.stdout.rstrip())
        if p.returncode:
            raise FlowError("push falhou; commit local foi preservado")
        push_done = True

        subprocess.run(["git", "fetch", "origin", EXPECTED_BRANCH, "--quiet"], cwd=repo)
        if cmd_out(["git", "rev-parse", "HEAD"], repo) != cmd_out(
            ["git", "rev-parse", f"origin/{EXPECTED_BRANCH}"], repo
        ):
            raise FlowError("HEAD e origin/main não coincidem")

        for slug in slugs:
            url = f"{args.base_url.rstrip('/')}/guias/{slug}/"
            log.write(f"aguardando deploy: {url}")
            if not wait_200(url, log, args.attempts, args.interval):
                raise FlowError(
                    f"Deploy ainda não retornou 200 para {url}; push já foi realizado"
                )

        vlog = work_logs() / f"eep-work-verify-{stamp()}.txt"
        rc = run_to_file(
            ["npm", "run", "eep:verify", "--", args.base_url.rstrip("/")],
            repo,
            vlog,
        )
        log.write(f"eep:verify = {rc}")
        log.write(f"log completo: {vlog}")
        log.write(tail(vlog, 40))
        if rc:
            raise FlowError("eep:verify falhou depois do push")

        if status(repo):
            raise FlowError("Git não ficou limpo ao final")

        log.write(f"RELEASE OK. TXT: {log.path}")
        return 0

    except Exception as e:
        log.write(f"ERRO: {e}")
        if commit_created and not push_done:
            log.write(
                "ESTADO: commit local criado, mas push não concluído. "
                "Não faça novo commit sem revisar este TXT."
            )
        elif push_done:
            log.write(
                "ESTADO: push concluído. Eventual erro ocorreu na etapa de deploy/verificação."
            )
        else:
            log.write(
                "ESTADO: nenhum push realizado. Verifique o status do Git antes de repetir."
            )
        log.write(f"TXT: {log.path}")
        return 1
    finally:
        log.close()

def do_verify(args):
    log = Log("verify")
    try:
        repo = repo_ok(Path(args.repo)); repo_identity(repo)
        vlog = work_logs() / f"eep-work-verify-{stamp()}.txt"
        rc = run_to_file(["npm", "run", "eep:verify", "--", args.base_url.rstrip("/")], repo, vlog)
        log.write(f"eep:verify = {rc}"); log.write(f"log: {vlog}"); log.write(tail(vlog, 40)); log.write(f"TXT: {log.path}")
        return rc
    except Exception as e:
        log.write(f"ERRO: {e}"); log.write(f"TXT: {log.path}"); return 1
    finally:
        log.close()


def parser():
    p = argparse.ArgumentParser(description="EEP Workflow V2")
    p.add_argument("--repo", default=".", help="Pasta do repositório EEP; padrão: diretório atual")
    sp = p.add_subparsers(dest="action", required=True)
    x = sp.add_parser("doctor", help="Diagnóstico somente leitura"); x.set_defaults(fn=do_doctor)
    x = sp.add_parser("prepare", help="Importa Markdown + imagem, converte WebP e valida")
    x.add_argument("--article", action="append", required=True, help="Markdown em draft:true; repita para lote")
    x.add_argument("--image", action="append", required=True, help="Imagem correspondente; repita na mesma ordem")
    x.add_argument("--image-alt", action="append", default=[], metavar="SLUG=TEXTO", help="Alt se ausente no Markdown")
    x.set_defaults(fn=do_prepare)
    x = sp.add_parser("release", help="eep:publish + inspeção + commit + push + eep:verify")
    x.add_argument("--slug", action="append", required=True, help="Slug preparado; repita para lote")
    x.add_argument("--message", help="Mensagem de commit")
    x.add_argument("--base-url", default=BASE_URL)
    x.add_argument("--attempts", type=int, default=12)
    x.add_argument("--interval", type=int, default=15)
    x.set_defaults(fn=do_release)
    x = sp.add_parser("verify", help="Executa apenas eep:verify remoto")
    x.add_argument("--base-url", default=BASE_URL); x.set_defaults(fn=do_verify)
    return p


def main():
    args = parser().parse_args()
    return args.fn(args)

if __name__ == "__main__":
    raise SystemExit(main())
