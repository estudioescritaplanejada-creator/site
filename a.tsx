import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Wrench, 
  Calendar, 
  FolderTree, 
  FileText, 
  Users, 
  Scale, 
  History, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  ArrowRight, 
  Download, 
  Paperclip, 
  Check, 
  X, 
  Info, 
  ChevronRight, 
  Eye,
  AlertCircle,
  Smartphone,
  CalendarDays,
  Shield,
  HelpCircle,
  Maximize2
} from 'lucide-react';


// Dados iniciais mockados baseados rigorosamente no planejamento do Condomínio Patrícia
const INITIAL_SYSTEMS = [
  { id: 1, name: 'Combate a Incêndio', description: 'Sistemas de bombas, hidrantes, alarmes, extintores e SPDA', lead: 'Carlos Silva (Engenheiro)', criticality: 'Alta' },
  { id: 2, name: 'Hidráulica e Esgoto', description: 'Bombas de recalque, cisterna, caixas d água, prumadas e esgoto', lead: 'Roberto Souza (Zelador)', criticality: 'Alta' },
  { id: 3, name: 'Elétrica', description: 'Painéis elétricos, gerador, subestação e iluminação de emergência', lead: 'Carlos Silva (Engenheiro)', criticality: 'Alta' },
  { id: 4, name: 'Elevadores', description: 'Elevadores sociais e de serviço - Torre A e B', lead: 'Elevare Elevadores (Contrato)', criticality: 'Alta' },
  { id: 5, name: 'Segurança e CFTV', description: 'Câmeras, DVR, portões automáticos, clausuras e interfonia', lead: 'Zeladoria', criticality: 'Média' },
  { id: 6, name: 'Estrutura e Civil', description: 'Fachada, impermeabilização, garagens e áreas comuns', lead: 'Síndico / Conselho', criticality: 'Média' }
];

const INITIAL_ASSETS = [
  { id: 101, systemId: 2, name: 'Bomba de Recalque (Cisterna 01)', assetType: 'Equipamento Hidráulico', location: 'Subsolo Torre A', manufacturer: 'Schneider', model: 'BC-92S', serialNumber: 'SCH-88371-2024', installationDate: '2024-05-10', warrantyUntil: '2027-05-10', status: 'Ativo', supplierId: 3 },
  { id: 102, systemId: 4, name: 'Elevador Social - Torre A', assetType: 'Transporte Vertical', location: 'Hall Principal Torre A', manufacturer: 'Otis', model: 'Gen2 Light', serialNumber: 'OTIS-TORRE-A-01', installationDate: '2023-11-20', warrantyUntil: '2026-11-20', status: 'Ativo', supplierId: 4 },
  { id: 103, systemId: 1, name: 'Central de Alarme de Incêndio', assetType: 'Segurança/Prevenção', location: 'Portaria Guarita', manufacturer: 'Intelbras', model: 'CIC 24L', serialNumber: 'INT-99211-CI', installationDate: '2025-01-15', warrantyUntil: '2026-01-15', status: 'Ativo', supplierId: 1 },
  { id: 104, systemId: 3, name: 'Gerador de Emergência (Grupo Motor)', assetType: 'Gerador', location: 'Área Externa - Atrás Bloco B', manufacturer: 'Stemac', model: '150 kVA', serialNumber: 'STEM-003482', installationDate: '2024-02-18', warrantyUntil: '2026-02-18', status: 'Ativo', supplierId: 2 }
];

const INITIAL_SUPPLIERS = [
  { id: 1, name: 'Ontech Sistemas de Incêndio', contact: 'Marcos Rezende', phone: '(41) 98888-1111', email: 'contato@ontech.com.br', rating: 4.8, active: true, category: 'Combate a Incêndio' },
  { id: 2, name: 'Grupo Sul Geradores', contact: 'Fernanda Lima', phone: '(41) 98888-2222', email: 'manutencao@gruposul.com.br', rating: 4.5, active: true, category: 'Geradores e Elétrica' },
  { id: 3, name: 'Clenir Bombas Hidráulicas', contact: 'Ademir Clenir', phone: '(41) 99111-3333', email: 'ademir@clenir.com.br', rating: 4.9, active: true, category: 'Hidráulica' },
  { id: 4, name: 'Elevare Elevadores', contact: 'Eng. Ricardo', phone: '(41) 3333-4444', email: 'chamados@elevare.com.br', rating: 4.2, active: true, category: 'Elevadores' },
  { id: 5, name: 'Algrin Impermeabilizações', contact: 'Mário Algrin', phone: '(41) 99555-5555', email: 'orcamentos@algrin.com.br', rating: 4.7, active: true, category: 'Engenharia Civil' }
];

const INITIAL_WORK_ORDERS = [
  {
    id: 1,
    code: 'OS-2026-0001',
    type: 'Corretiva',
    title: 'Vazamento no barrilete superior - Torre B',
    description: 'Identificado gotejamento na junta de dilatação do barrilete que alimenta a prumada 3 da Torre B.',
    systemId: 2,
    assetId: 101,
    location: 'Barrilete / Cobertura Torre B',
    priority: 'Alta',
    status: 'Em execução',
    responsibleUserId: 'Roberto Souza (Zelador)',
    supplierId: 3,
    openedAt: '2026-07-12',
    dueDate: '2026-07-18',
    nextAction: 'Instalação de luva de correr e nova junta pela Clenir',
    estimatedCost: 1200.00,
    approvedCost: 1200.00,
    finalCost: 0,
    paymentStatus: 'Aguardando execução',
    requiredDocuments: ['Nota Fiscal', 'Relatório Técnico'],
    createdAt: '2026-07-12',
    history: [
      { date: '2026-07-12 09:00', user: 'Roberto Souza', action: 'Abertura da OS constatando vazamento.' },
      { date: '2026-07-12 11:30', user: 'Carlos Silva', action: 'Status alterado para "Em execução" e vinculado fornecedor Clenir.' }
    ]
  },
  {
    id: 2,
    code: 'OS-2026-0002',
    type: 'Preventiva',
    title: 'Manutenção Trimestral de Elevadores - Torre A',
    description: 'Lubrificação de guias, medição de cabos de tração, testes de sensores de porta e limites de curso.',
    systemId: 4,
    assetId: 102,
    location: 'Casa de Máquinas / Poço Torre A',
    priority: 'Média',
    status: 'Agendado',
    responsibleUserId: 'Elevare Elevadores (Contrato)',
    supplierId: 4,
    openedAt: '2026-07-10',
    dueDate: '2026-07-20',
    nextAction: 'Visita agendada para o dia 18/07 na parte da manhã.',
    estimatedCost: 850.00,
    approvedCost: 850.00,
    finalCost: 0,
    paymentStatus: 'Mensalidade do Contrato',
    requiredDocuments: ['Laudo de Inspeção'],
    createdAt: '2026-07-10',
    history: [
      { date: '2026-07-10 14:00', user: 'Carlos Silva', action: 'Geração automática de rotina trimestral.' }
    ]
  },
  {
    id: 3,
    code: 'OS-2026-0003',
    type: 'Corretiva',
    title: 'Falha no sensor magnético da clausura de veículos',
    description: 'Portão de entrada não fecha automaticamente após passagem do veículo devido a desregulagem ou queima do sensor.',
    systemId: 5,
    location: 'Clausura de Veículos (Acesso Principal)',
    priority: 'Crítica',
    status: 'Aguardando retorno',
    responsibleUserId: 'Roberto Souza (Zelador)',
    openedAt: '2026-07-14',
    dueDate: '2026-07-16',
    nextAction: 'Cobrar envio de orçamento atualizado da empresa de segurança',
    lastContactDate: '2026-07-14',
    nextFollowUpDate: '2026-07-16',
    contactTarget: 'Ontech Segurança',
    estimatedCost: 350.00,
    approvedCost: 0,
    finalCost: 0,
    paymentStatus: 'Não Iniciado',
    requiredDocuments: [],
    createdAt: '2026-07-14',
    history: [
      { date: '2026-07-14 08:30', user: 'Roberto Souza', action: 'Constatado defeito no portão. Aberto chamado.' },
      { date: '2026-07-14 10:00', user: 'Roberto Souza', action: 'Contato telefônico realizado com Ontech. Aguardando técnico enviar preço.' }
    ]
  }
];

const INITIAL_PREVENTIVES = [
  { id: 1, assetId: 101, title: 'Limpeza e Sanitização de Caixas d Água', frequencyType: 'Meses', frequencyValue: 6, lastExecutionDate: '2026-01-15', nextDueDate: '2026-07-15', alertDaysBefore: 30, systemId: 2, estimatedCost: 3200.00, requiredDocuments: 'Certificado de Sanitização, Relatório de Potabilidade, Nota Fiscal', active: true },
  { id: 2, assetId: 104, title: 'Revisão com Troca de Filtros do Gerador', frequencyType: 'Meses', frequencyValue: 12, lastExecutionDate: '2025-08-20', nextDueDate: '2026-08-20', alertDaysBefore: 30, systemId: 3, estimatedCost: 1500.00, requiredDocuments: 'Laudo de Entrega Técnica, Nota Fiscal', active: true },
  { id: 3, assetId: 103, title: 'Teste de Pressão e Mangueiras de Incêndio', frequencyType: 'Meses', frequencyValue: 12, lastExecutionDate: '2025-09-05', nextDueDate: '2026-09-05', alertDaysBefore: 15, systemId: 1, estimatedCost: 1800.00, requiredDocuments: 'Relatório de Ensaio Hidrostático (ART)', active: true }
];

const INITIAL_DECISIONS = [
  { id: 1, subject: 'Aprovação de Orçamento para Adequação do SPDA', context: 'O SPDA atual do condomínio foi reprovado no laudo de engenharia emitido em Junho. Risco de queima de placas eletrônicas e acidentes com descargas atmosféricas.', alternatives: 'Empresa A (Ontech): R$ 8.500,00 | Empresa B (Sul Eng): R$ 9.200,00 com melhor prazo', riskOfNotDoing: 'Multa ambiental/municipal e invalidação de cobertura da apólice de seguro do prédio.', estimatedCost: 8500.00, lead: 'Carlos Silva', deadline: '2026-07-25', status: 'Pendente', justification: '', date: '', minutesRef: '' },
  { id: 2, subject: 'Impermeabilização do Piso da Garagem Torre A', context: 'Infiltrações pontuais gotejando sobre veículos no subsolo estão gerando atrito com moradores e danos à pintura de carros.', alternatives: 'Algrin: R$ 14.000,00 (5 anos garantia) | ImperMax: R$ 11.500,00 (3 anos garantia)', riskOfNotDoing: 'Corrosão de armadura estrutural do teto do subsolo.', estimatedCost: 14000.00, lead: 'Síndico', deadline: '2026-08-10', status: 'Aprovado', justification: 'Aprovado com a empresa Algrin pelo conselho em ata do dia 05/07 devido à maior garantia oferecida.', date: '2026-07-05', minutesRef: 'Ata Conselho Ordinário 07/26' }
];

const INITIAL_DOCUMENTS = [
  { id: 1, title: 'Laudo de Medição do SPDA - 2026', documentType: 'Laudo Técnico', originalFilename: 'laudo_spda_reprovado_junho2026.pdf', sizeBytes: 3245000, issuedAt: '2026-06-10', expiresAt: '2027-06-10', systemId: 1, supplierId: 1, uploadedBy: 'Carlos Silva', uploadedAt: '2026-06-11' },
  { id: 2, title: 'Certificado de Lavagem das Caixas de Água', documentType: 'Certificado', originalFilename: 'cert_lavagem_caixas_agua_jan2026.pdf', sizeBytes: 1540000, issuedAt: '2026-01-15', expiresAt: '2026-07-15', systemId: 2, supplierId: 3, uploadedBy: 'Roberto Souza', uploadedAt: '2026-01-15' }
];

const INITIAL_AUDIT = [
  { id: 1, userId: 'Roberto Souza', action: 'Criação do chamado corretivo OS-2026-0003', details: 'Abertura de vazamento na clausura', timestamp: '2026-07-14 08:30:00' },
  { id: 2, userId: 'Carlos Silva', action: 'Atualização do chamado OS-2026-0001', details: 'Alterou status para "Em execução" e estimou custos', timestamp: '2026-07-12 11:30:00' },
  { id: 3, userId: 'Administrador', action: 'Inclusão do documento Laudo de Medição do SPDA', details: 'Inserido no módulo de documentos vinculados', timestamp: '2026-06-11 15:42:00' }
];


export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [workOrders, setWorkOrders] = useState(INITIAL_WORK_ORDERS);
  const [preventives, setPreventives] = useState(INITIAL_PREVENTIVES);
  const [decisions, setDecisions] = useState(INITIAL_DECISIONS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT);
  const [suppliers] = useState(INITIAL_SUPPLIERS);
  const [systems] = useState(INITIAL_SYSTEMS);
  const [assets] = useState(INITIAL_ASSETS);

  // States para Controle de Filtros & Modais
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [priorityFilter, setPriorityFilter] = useState('Todos');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Formulário de Nova OS
  const [newOrderForm, setNewOrderForm] = useState({
    title: '',
    type: 'Corretiva',
    systemId: 1,
    assetId: '',
    location: '',
    priority: 'Média',
    status: 'a esclarecer',
    description: '',
    responsibleUserId: 'Zeladoria',
    supplierId: '',
    nextAction: '',
    dueDate: '',
    estimatedCost: '',
    lastContactDate: '',
    nextFollowUpDate: '',
    contactTarget: ''
  });

  // Formulário de Conclusão de OS
  const [completeForm, setCompleteForm] = useState({
    executionDate: '',
    description: '',
    finalCost: '',
    executor: '',
    warrantyUntil: '',
    hasEvidence: false,
    evidenceText: ''
  });

  // Mostrar mensagens flutuantes (Toasts)
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };


  // Helper para salvar logs de auditoria
  const logAudit = (userId, action, details) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newLog = {
      id: auditLogs.length + 1,
      userId,
      action,
      details,
      timestamp
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Regra de Negócio: Recorrência Automática de Preventiva
  const handleCompletePreventive = (preventiveId) => {
    const plan = preventives.find(p => p.id === preventiveId);
    if (!plan) return;

    // Calcular próximo vencimento
    const lastDate = new Date();
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + plan.frequencyValue);

    const formattedLast = lastDate.toISOString().split('T')[0];
    const formattedNext = nextDate.toISOString().split('T')[0];

    // Atualizar plano preventivo
    setPreventives(prev => prev.map(p => {
      if (p.id === preventiveId) {
        return {
          ...p,
          lastExecutionDate: formattedLast,
          nextDueDate: formattedNext
        };
      }
      return p;
    }));

    // Gerar a Ordem de Serviço automática para o próximo ciclo
    const newOSCode = `OS-2026-PREV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOS = {
      id: workOrders.length + 1,
      code: newOSCode,
      type: 'Preventiva',
      title: `[Rotina] ${plan.title}`,
      description: `Ciclo preventivo de recorrência automática de ${plan.frequencyValue} em ${plan.frequencyValue} meses.`,
      systemId: plan.systemId,
      assetId: plan.assetId,
      location: 'Geral do Condomínio / Conforme Ativo',
      priority: 'Média',
      status: 'Agendado',
      responsibleUserId: 'Zeladoria',
      openedAt: formattedLast,
      dueDate: formattedNext,
      nextAction: 'Executar verificação visual e conforme manuais.',
      estimatedCost: plan.estimatedCost,
      approvedCost: plan.estimatedCost,
      finalCost: 0,
      paymentStatus: 'Não Iniciado',
      requiredDocuments: plan.requiredDocuments.split(','),
      createdAt: formattedLast,
      history: [
        { date: `${formattedLast} 12:00`, user: 'Robô de Recorrência', action: `Geração automática decorrente da conclusão do ciclo anterior.` }
      ]
    };

    setWorkOrders(prev => [newOS, ...prev]);
    logAudit('Sistema (Cron)', `Preventiva Recorrente Ativada (${plan.title})`, `Geração da OS ${newOSCode} para data ${formattedNext}`);
    showToast(`Plano "${plan.title}" atualizado. Nova OS gerada para ${formattedNext}!`, 'success');
  };

  // Regra de Negócio: Aprovar Decisões e Gerar OS decorrentes
  const handleApproveDecision = (decisionId, justification) => {
    const decision = decisions.find(d => d.id === decisionId);
    if (!decision) return;

    // Atualiza status da decisão
    setDecisions(prev => prev.map(d => {
      if (d.id === decisionId) {
        return {
          ...d,
          status: 'Aprovado',
          justification: justification || 'Aprovado pelo conselho de administração.',
          date: '2026-07-15'
        };
      }
      return d;
    }));

    // Gera a Ordem de Serviço decorrente da decisão
    const newOSCode = `OS-2026-DEC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOS = {
      id: workOrders.length + 1,
      code: newOSCode,
      type: 'Projeto',
      title: decision.subject,
      description: `Execução decorrente da decisão do conselho. Contexto: ${decision.context}`,
      systemId: 1, // Default Combate ou Conforme Decisão
      location: 'Áreas comuns do condomínio',
      priority: 'Alta',
      status: 'Aguardando orçamento',
      responsibleUserId: decision.lead,
      openedAt: '2026-07-15',
      dueDate: decision.deadline,
      nextAction: 'Solicitar propostas comerciais de 3 empresas.',
      estimatedCost: decision.estimatedCost,
      approvedCost: 0,
      finalCost: 0,
      paymentStatus: 'Aprovado em Conselho',
      requiredDocuments: ['Propostas Comerciais', 'Ata de Aprovação'],
      createdAt: '2026-07-15',
      history: [
        { date: '2026-07-15 14:00', user: 'Gestor (Gemini)', action: `Abertura da OS desencadeada por aprovação da Decisão ID: ${decision.id}` }
      ]
    };

    setWorkOrders(prev => [newOS, ...prev]);
    logAudit('Síndico/Conselho', `Decisão Aprovada: ${decision.subject}`, `Gerada a OS ${newOSCode} para execução.`);
    showToast(`Decisão aprovada e ${newOSCode} gerada para acompanhamento!`, 'success');
  };


  // Salvar Nova OS do Formulário
  const handleSaveNewOrder = (e) => {
    e.preventDefault();
    
    // Regra de Negócio 5.1: Nenhuma tarefa aberta sem próxima ação
    if (!newOrderForm.nextAction.trim()) {
      showToast('Nenhuma OS pode ser criada sem a "Próxima Ação" definida!', 'error');
      return;
    }

    // Regra de Negócio 5.2: "Aguardando retorno" exige data
    if (newOrderForm.status === 'Aguardando retorno' && (!newOrderForm.nextFollowUpDate || !newOrderForm.contactTarget)) {
      showToast('O status "Aguardando Retorno" exige preencher: Quem deve responder, Último contato e Próxima cobrança!', 'error');
      return;
    }

    const nextId = workOrders.length + 1;
    const generatedCode = `OS-2026-${String(nextId).padStart(4, '0')}`;

    const newOrder = {
      ...newOrderForm,
      id: nextId,
      code: generatedCode,
      systemId: Number(newOrderForm.systemId),
      assetId: newOrderForm.assetId ? Number(newOrderForm.assetId) : null,
      supplierId: newOrderForm.supplierId ? Number(newOrderForm.supplierId) : null,
      estimatedCost: Number(newOrderForm.estimatedCost) || 0,
      approvedCost: Number(newOrderForm.estimatedCost) || 0,
      finalCost: 0,
      openedAt: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      history: [
        { date: '2026-07-15 14:00', user: 'Gestor', action: 'Abertura manual do chamado.' }
      ]
    };

    setWorkOrders(prev => [newOrder, ...prev]);
    logAudit('Gestor', `Criou OS ${generatedCode}`, `Título: ${newOrder.title}`);
    setShowNewOrderModal(false);
    showToast(`OS ${generatedCode} cadastrada com sucesso!`, 'success');

    // Reset Form
    setNewOrderForm({
      title: '', type: 'Corretiva', systemId: 1, assetId: '', location: '',
      priority: 'Média', status: 'a esclarecer', description: '', responsibleUserId: 'Zeladoria',
      supplierId: '', nextAction: '', dueDate: '', estimatedCost: '',
      lastContactDate: '', nextFollowUpDate: '', contactTarget: ''
    });
  };

  // Finalizar OS com Comprovação Obrigatória (Regra 5.3)
  const handleFinalizeOrderSubmit = (e) => {
    e.preventDefault();

    if (!completeForm.executionDate || !completeForm.executor) {
      showToast('Preencha os dados obrigatórios de execução e executor!', 'error');
      return;
    }

    if (!completeForm.hasEvidence && !completeForm.evidenceText.trim()) {
      showToast('Regra do Sistema: É obrigatório anexar foto/evidência ou fornecer justificativa para ausência!', 'error');
      return;
    }

    // Atualizar OS
    setWorkOrders(prev => prev.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          status: 'concluído',
          completedAt: completeForm.executionDate,
          finalCost: Number(completeForm.finalCost) || order.estimatedCost,
          warrantyUntil: completeForm.warrantyUntil || null,
          history: [
            ...order.history,
            { 
              date: `${completeForm.executionDate} 17:00`, 
              user: completeForm.executor, 
              action: `Conclusão registrada. Comprovação: ${completeForm.hasEvidence ? "Mídia enviada" : "Justificada: " + completeForm.evidenceText}` 
            }
          ]
        };
      }
      return order;
    }));

    // Se a OS concluída for de um plano preventivo ativo, atualiza a periodicidade
    const matchPrev = preventives.find(p => p.systemId === selectedOrder.systemId && selectedOrder.title.includes(p.title));
    if (matchPrev) {
      handleCompletePreventive(matchPrev.id);
    }

    logAudit('Zeladoria/Fornecedor', `Concluiu OS ${selectedOrder.code}`, `Executado por: ${completeForm.executor}. Custo Final: R$ ${completeForm.finalCost}`);
    setShowCompleteModal(false);
    setSelectedOrder(null);
    showToast(`Ordem de serviço concluída com comprovação!`, 'success');
  };


  // Dados filtrados de ordens de serviço
  const filteredOrders = useMemo(() => {
    return workOrders.filter(order => {
      const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            order.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'Todos' || order.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesPriority = priorityFilter === 'Todos' || order.priority.toLowerCase() === priorityFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [workOrders, searchQuery, statusFilter, priorityFilter]);

  // Cálculos consolidados para exibição nos cards do Painel (Dashboard)
  const dashboardStats = useMemo(() => {
    const openOrders = workOrders.filter(o => o.status !== 'concluído' && o.status !== 'cancelado');
    const overdueOrders = openOrders.filter(o => {
      if (!o.dueDate) return false;
      return new Date(o.dueDate) < new Date('2026-07-15'); // Data corrente fixada na instrução
    });
    
    const criticalOpen = openOrders.filter(o => o.priority === 'Crítica').length;
    const waitingDecision = openOrders.filter(o => o.status === 'aguardando decisão').length;
    const blockedOrders = openOrders.filter(o => o.status === 'bloqueado').length;

    // Custos
    const approvedCost = workOrders.reduce((sum, o) => sum + (o.approvedCost || 0), 0);
    const executedCost = workOrders.reduce((sum, o) => sum + (o.finalCost || 0), 0);

    return {
      totalOpen: openOrders.length,
      overdue: overdueOrders.length,
      critical: criticalOpen,
      waitingDecision,
      blocked: blockedOrders,
      approvedCost,
      executedCost
    };
  }, [workOrders]);


  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans antialiased">
      
      {/* Toast flutuante de feedback */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 ${
          toast.type === 'error' ? 'bg-rose-500 text-white border border-rose-600' : 'bg-emerald-500 text-white border border-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
          <p className="font-semibold text-sm">{toast.message}</p>
        </div>
      )}

      {/* Header do Mock Simulator */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 px-4 py-2 flex flex-wrap justify-between items-center text-xs font-semibold shadow-md gap-2">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-slate-900 animate-pulse" />
          <span>AMBIENTE DE PREVIEW CLOUD CLIENT DE MOCK-UP COMPLETO</span>
        </div>
        <div className="flex items-center gap-4">
          <span>📅 Data do Sistema: 15/07/2026</span>
          <span className="bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded-full text-[10px]">Cloudflare Edge Simulator v1.0</span>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="flex flex-col lg:flex-row flex-1">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-72 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-600/30">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-none">Cond. Patrícia</h1>
                <span className="text-xs text-slate-400">Sistema de Manutenção</span>
              </div>
            </div>

            <nav className="space-y-1.5">
              {[
                { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
                { id: 'work-orders', label: 'Ordens de Serviço', icon: Wrench, badge: dashboardStats.totalOpen },
                { id: 'preventives', label: 'Planos Preventivos', icon: Shield, badge: preventives.filter(p => new Date(p.nextDueDate) <= new Date('2026-07-15')).length },
                { id: 'calendar', label: 'Calendário Técnico', icon: Calendar },
                { id: 'systems', label: 'Sistemas e Ativos', icon: FolderTree },
                { id: 'decisions', label: 'Módulo de Decisões', icon: Scale, badge: decisions.filter(d => d.status === 'Pendente').length },
                { id: 'suppliers', label: 'Fornecedores', icon: Users },
                { id: 'documents', label: 'Documentos R2', icon: FileText },
                { id: 'audit', label: 'Histórico & Auditoria', icon: History }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-indigo-600 text-white font-semibold' 
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-slate-950 text-indigo-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-300 font-bold text-sm">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Administrador</p>
              <p className="text-[10px] text-slate-400">admin@condpatricia.com.br</p>
            </div>
          </div>
        </aside>

        {/* Dynamic Client Tab Render area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-h-screen">
          
          {}

          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Painel Geral de Manutenção</h2>
                  <p className="text-slate-400 text-sm">Visão geral em tempo real de todas as tarefas e ativos prediais.</p>
                </div>
                <button 
                  onClick={() => setShowNewOrderModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <Plus className="w-4 h-4" /> Nova Ordem de Serviço
                </button>
              </div>

              {/* Status Counters Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Ocorrências Críticas', value: dashboardStats.critical, icon: AlertTriangle, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
                  { label: 'OS Atrasadas', value: dashboardStats.overdue, icon: Clock, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
                  { label: 'Aguardando Decisão', value: dashboardStats.waitingDecision, icon: Scale, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' },
                  { label: 'OS Ativas em Aberto', value: dashboardStats.totalOpen, icon: Wrench, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' }
                ].map((stat, i) => (
                  <div key={i} className={`p-4 rounded-2xl border ${stat.color} flex items-center justify-between`}>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                      <h3 className="text-2xl font-extrabold mt-1">{stat.value}</h3>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/50">
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Status Summary */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Resumo de Fluxo Financeiro (Serviços Técnico-Prediais)</h4>
                    <p className="text-xs text-slate-400">Total acumulado para as manutenções cadastradas na base atual.</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                    <span className="text-xs text-slate-400">Valor Total Aprovado</span>
                    <p className="text-2xl font-bold text-white mt-1">R$ {dashboardStats.approvedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                      <div className="bg-indigo-600 h-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                    <span className="text-xs text-slate-400">Valor Total Pago/Executado</span>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">R$ {dashboardStats.executedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${(dashboardStats.executedCost / (dashboardStats.approvedCost || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick List / Urgent actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Alertas de Vencimento e Preventivas de Hoje */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 lg:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Planos Preventivos Exigindo Ação
                    </h4>
                    <span className="text-xs text-slate-400">Próximos 30 dias</span>
                  </div>
                  <div className="space-y-3">
                    {preventives.map((p) => {
                      const isOverdue = new Date(p.nextDueDate) <= new Date('2026-07-15');
                      return (
                        <div key={p.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
                          <div>
                            <p className="text-sm font-bold text-slate-200">{p.title}</p>
                            <span className="text-xs text-slate-400">Periodicidade: {p.frequencyValue} {p.frequencyType}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className={`text-xs font-semibold ${isOverdue ? 'text-rose-500' : 'text-slate-300'}`}>
                                Vence em: {p.nextDueDate.split('-').reverse().join('/')}
                              </p>
                              <span className="text-[10px] text-slate-500">Última: {p.lastExecutionDate.split('-').reverse().join('/')}</span>
                            </div>
                            <button 
                              onClick={() => handleCompletePreventive(p.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" /> Concluir Ciclo
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Resumo de Auditoria Rápido */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-400" />
                    Atividade Recente (Logs)
                  </h4>
                  <div className="space-y-4">
                    {auditLogs.slice(0, 4).map((log) => (
                      <div key={log.id} className="relative pl-5 pb-3 last:pb-0 border-l-2 border-slate-800">
                        <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                        <p className="text-xs text-slate-300 font-medium leading-none">{log.action}</p>
                        <span className="text-[10px] text-slate-500 block mt-1">{log.timestamp} • {log.userId}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {}

          {currentTab === 'work-orders' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Ordens de Serviço</h2>
                  <p className="text-slate-400 text-sm">Controle de preventivas, corretivas e novos projetos do condomínio.</p>
                </div>
                <button 
                  onClick={() => setShowNewOrderModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> Nova Ordem de Serviço
                </button>
              </div>

              {/* Filters Box */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute left-3 top-2.5 text-slate-500 w-4.5 h-4.5" />
                  <input 
                    type="text" 
                    placeholder="Buscar por código, título ou descrição..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-400">Prioridade:</span>
                    <select 
                      value={priorityFilter} 
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="bg-transparent text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="Todos" className="bg-slate-900">Todos</option>
                      <option value="Crítica" className="bg-slate-900">Crítica</option>
                      <option value="Alta" className="bg-slate-900">Alta</option>
                      <option value="Média" className="bg-slate-900">Média</option>
                      <option value="Baixa" className="bg-slate-900">Baixa</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-400">Status:</span>
                    <select 
                      value={statusFilter} 
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-transparent text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="Todos" className="bg-slate-900">Todos</option>
                      <option value="a esclarecer" className="bg-slate-900">A Esclarecer</option>
                      <option value="Em execução" className="bg-slate-900">Em Execução</option>
                      <option value="Aguardando retorno" className="bg-slate-900">Aguardando Retorno</option>
                      <option value="Agendado" className="bg-slate-900">Agendado</option>
                      <option value="Aguardando decisão" className="bg-slate-900">Aguardando Decisão</option>
                      <option value="concluído" className="bg-slate-900">Concluído</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* OS List Rendering */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-800">
                    <Wrench className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">Nenhuma ordem de serviço localizada com os filtros selecionados.</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const hasRuleWarning = !order.nextAction || order.nextAction.trim() === '';
                    const isFollowUpOverdue = order.status === 'Aguardando retorno' && (!order.nextFollowUpDate || new Date(order.nextFollowUpDate) <= new Date('2026-07-15'));
                    
                    return (
                      <div 
                        key={order.id} 
                        className={`p-5 bg-slate-950 rounded-2xl border transition-all hover:border-slate-700 ${
                          order.priority === 'Crítica' ? 'border-l-4 border-l-rose-500' : 'border-slate-800'
                        }`}
                      >
                        <div className="flex flex-wrap justify-between items-start gap-3">
                          <div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-xs font-bold text-indigo-400">{order.code}</span>
                              <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                                order.type === 'Corretiva' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                                order.type === 'Preventiva' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                                'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              }`}>
                                {order.type}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                order.priority === 'Crítica' ? 'bg-rose-900/30 text-rose-400' :
                                order.priority === 'Alta' ? 'bg-amber-900/30 text-amber-400' : 'bg-slate-800 text-slate-300'
                              }`}>
                                Prioridade {order.priority}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-white mt-1.5">{order.title}</h3>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-3xl">{order.description}</p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-slate-500">Previsão:</span>
                            <p className="text-xs font-bold text-slate-300">{order.dueDate ? order.dueDate.split('-').reverse().join('/') : 'N/A'}</p>
                            <span className="text-xs text-slate-400 font-semibold block mt-1">
                              Est: R$ {order.estimatedCost?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        {/* Critical Alerts based on Rule 5.1 & 5.2 */}
                        {(hasRuleWarning || isFollowUpOverdue) && (
                          <div className="mt-4 p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl flex items-center gap-2.5 text-xs text-amber-400">
                            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                            <div>
                              {hasRuleWarning && <p className="font-semibold">Erro: Cadastro incompleto. Não possui "Próxima Ação" definida no sistema!</p>}
                              {isFollowUpOverdue && <p className="font-semibold">Cobrança Exigida: Aguardando retorno da empresa sem data de acompanhamento ou data expirada!</p>}
                            </div>
                          </div>
                        )}

                        {/* Action Bar inside OS item */}
                        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap justify-between items-center gap-3">
                          <div className="text-xs text-slate-400 flex items-center gap-4">
                            <span>📍 <strong>Local:</strong> {order.location}</span>
                            <span>👤 <strong>Resp:</strong> {order.responsibleUserId}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setSelectedOrder(order);
                              }}
                              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" /> Detalhes & Histórico
                            </button>
                            
                            {order.status !== 'concluído' && (
                              <button 
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowCompleteModal(true);
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
                              >
                                <Check className="w-3.5 h-3.5" /> Concluir OS
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {}

          {currentTab === 'preventives' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Cronograma e Planos Preventivos</h2>
                <p className="text-slate-400 text-sm">Controle de rotinas obrigatórias recorrentes para segurança e conservação predial.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {preventives.map((plan) => {
                  const asset = assets.find(a => a.id === plan.assetId);
                  const system = systems.find(s => s.id === plan.systemId);
                  const isOverdue = new Date(plan.nextDueDate) <= new Date('2026-07-15');

                  return (
                    <div key={plan.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wide">
                            {system?.name}
                          </span>
                          {isOverdue && (
                            <span className="bg-rose-500/10 text-rose-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-rose-500/20">
                              Alerta Ativo
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-white leading-snug">{plan.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">Equipamento: <strong>{asset?.name || 'Geral'}</strong></p>

                        <div className="my-4 space-y-2 border-y border-slate-800/50 py-3 text-xs text-slate-300">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Periodicidade:</span>
                            <span className="font-semibold">A cada {plan.frequencyValue} {plan.frequencyType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Última Execução:</span>
                            <span className="font-semibold">{plan.lastExecutionDate.split('-').reverse().join('/')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Próximo Vencimento:</span>
                            <span className={`font-bold ${isOverdue ? 'text-rose-500' : 'text-emerald-400'}`}>
                              {plan.nextDueDate.split('-').reverse().join('/')}
                            </span>
                          </div>
                          <div className="pt-2">
                            <span className="text-slate-500 block mb-1">Mídia/Documentos Requeridos:</span>
                            <span className="text-[10px] text-indigo-400 font-mono bg-indigo-950/20 px-2 py-1 rounded block truncate">
                              {plan.requiredDocuments}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleCompletePreventive(plan.id)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Registrar Execução do Ciclo
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {}

          {currentTab === 'calendar' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Calendário Técnico Mensal</h2>
                <p className="text-slate-400 text-sm">Cronograma consolidado de manutenções programadas para Julho de 2026.</p>
              </div>

              {/* Mock Calendar Grid */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-base">Julho 2026</h3>
                  <div className="flex gap-2">
                    <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">Filtro: Todos</span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 mb-2">
                  <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for offset */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-24 bg-slate-900/10 border border-slate-800/10 rounded-xl"></div>
                  ))}

                  {/* Days of the Month */}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === 15; // 15/07/2026
                    
                    // Match any OS or Preventive due on this day
                    const matchingOS = workOrders.filter(o => {
                      if (!o.dueDate) return false;
                      const dateObj = new Date(o.dueDate);
                      return dateObj.getDate() === day && dateObj.getMonth() === 6; // Julho (0-indexed 6)
                    });

                    return (
                      <div 
                        key={day} 
                        className={`h-28 p-2 border rounded-xl flex flex-col justify-between text-left transition-all ${
                          isToday ? 'bg-indigo-950/40 border-indigo-500/50' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className={`text-xs font-bold ${isToday ? 'text-indigo-400 bg-indigo-500/20 px-1.5 py-0.5 rounded' : 'text-slate-400'}`}>
                          {day}
                        </span>

                        <div className="space-y-1 overflow-y-auto max-h-[60px]">
                          {matchingOS.map((os, idx) => (
                            <div 
                              key={idx} 
                              className={`text-[9px] px-1 py-0.5 rounded truncate font-semibold leading-tight ${
                                os.priority === 'Crítica' ? 'bg-rose-950 text-rose-300 border border-rose-800/30' : 
                                os.type === 'Preventiva' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/30' : 
                                'bg-slate-800 text-slate-200'
                              }`}
                            >
                              {os.code}: {os.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {}

          {currentTab === 'systems' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Sistemas Prediais & Equipamentos (Ativos)</h2>
                <p className="text-slate-400 text-sm">Estruturação de todas as frentes de engenharia do Condomínio Patrícia.</p>
              </div>

              {/* Systems List */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <FolderTree className="w-5 h-5 text-indigo-500" />
                    Sistemas Técnicos Estruturados
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {systems.map((sys) => (
                      <div key={sys.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                        <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full">
                          Criticidade {sys.criticality}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-2">{sys.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{sys.description}</p>
                        <div className="mt-3 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
                          Responsável Interno: <strong>{sys.lead}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assets List */}
                <div>
                  <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-indigo-500" />
                    Ativos e Equipamentos Inventariados
                  </h3>
                  <div className="overflow-x-auto bg-slate-950 border border-slate-800 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase bg-slate-900/50">
                          <th className="p-4">ID/Equipamento</th>
                          <th className="p-4">Tipo</th>
                          <th className="p-4">Localização</th>
                          <th className="p-4">Garantia Até</th>
                          <th className="p-4">Fabricante / Modelo</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs text-slate-300 divide-y divide-slate-800">
                        {assets.map((asset) => {
                          const system = systems.find(s => s.id === asset.systemId);
                          return (
                            <tr key={asset.id} className="hover:bg-slate-900/40">
                              <td className="p-4">
                                <span className="font-bold text-white block">{asset.name}</span>
                                <span className="text-[10px] text-slate-500">{system?.name} • ID {asset.id}</span>
                              </td>
                              <td className="p-4">{asset.assetType}</td>
                              <td className="p-4">{asset.location}</td>
                              <td className="p-4 text-emerald-400 font-semibold">{asset.warrantyUntil.split('-').reverse().join('/')}</td>
                              <td className="p-4 text-slate-400">{asset.manufacturer} ({asset.model})</td>
                              <td className="p-4">
                                <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">
                                  {asset.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {}

          {currentTab === 'decisions' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Módulo de Decisões do Conselho</h2>
                <p className="text-slate-400 text-sm">Questões estruturais pendentes de aprovação e geração de Ordens de Serviço.</p>
              </div>

              <div className="space-y-6">
                {decisions.map((decision) => (
                  <div key={decision.id} className="p-6 bg-slate-950 border border-slate-800 rounded-3xl relative">
                    <span className={`absolute top-6 right-6 text-xs font-bold px-3 py-1 rounded-full ${
                      decision.status === 'Aprovado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {decision.status}
                    </span>

                    <h3 className="text-lg font-bold text-white pr-24">{decision.subject}</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                      <div className="lg:col-span-2 space-y-3">
                        <p className="text-xs text-slate-400"><strong>Contexto:</strong> {decision.context}</p>
                        <p className="text-xs text-slate-400"><strong>Alternativas Disponíveis:</strong> {decision.alternatives}</p>
                        <p className="text-xs text-rose-400"><strong>Risco de não Executar:</strong> {decision.riskOfNotDoing}</p>
                      </div>

                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                        <p className="text-slate-500">Estimativa: <strong className="text-white">R$ {decision.estimatedCost.toLocaleString('pt-BR')}</strong></p>
                        <p className="text-slate-500">Responsável: <strong className="text-white">{decision.lead}</strong></p>
                        <p className="text-slate-500">Prazo Decisão: <strong className="text-white">{decision.deadline.split('-').reverse().join('/')}</strong></p>
                      </div>
                    </div>

                    {decision.status === 'Pendente' ? (
                      <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
                        <button 
                          onClick={() => handleApproveDecision(decision.id, 'Aprovado em reunião ordinária com o conselho.')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/10"
                        >
                          Aprovar Proposta & Gerar Ordem de Serviço
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
                        <p>✅ <strong>Decisão Homologada:</strong> {decision.justification}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">Ata de Referência: {decision.minutesRef || 'Sem referência'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {}

          {currentTab === 'suppliers' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Fornecedores Credenciados</h2>
                <p className="text-slate-400 text-sm">Histórico de empresas prestadoras de serviço com avaliações técnicas e contratos.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs bg-slate-900 border border-slate-800 text-indigo-400 font-bold px-2.5 py-0.5 rounded-full">
                          {supplier.category}
                        </span>
                        <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                          ⭐ {supplier.rating}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">{supplier.name}</h3>
                      
                      <div className="my-4 space-y-1 border-t border-slate-900 pt-3 text-xs text-slate-400">
                        <p><strong>Contato:</strong> {supplier.contact}</p>
                        <p><strong>Telefone:</strong> {supplier.phone}</p>
                        <p><strong>E-mail:</strong> {supplier.email}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-850 flex justify-between items-center text-xs">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Ativo na Base
                      </span>
                      <button className="text-indigo-400 hover:underline">Ver Orçamentos</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {}

          {currentTab === 'documents' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Biblioteca de Documentos R2</h2>
                <p className="text-slate-400 text-sm">Fotografias, laudos técnicos, ARTs, notas fiscais e relatórios com download seguro.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {documents.map((doc) => {
                  const system = systems.find(s => s.id === doc.systemId);
                  const supplier = suppliers.find(s => s.id === doc.supplierId);
                  return (
                    <div key={doc.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center gap-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-indigo-600/10 text-indigo-400 p-2.5 rounded-xl border border-indigo-500/20">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-snug">{doc.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">Arquivo: <span className="font-mono text-[10px] text-indigo-400">{doc.originalFilename}</span></p>
                          <div className="flex gap-4 text-[10px] text-slate-500 mt-2">
                            <span>Tipo: <strong>{doc.documentType}</strong></span>
                            <span>Tamanho: <strong>{(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB</strong></span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => showToast(`Simulando download seguro de: ${doc.originalFilename}`, 'success')}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-2.5 rounded-xl text-slate-200"
                        title="Download Autenticado R2"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {}

          {currentTab === 'audit' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Histórico de Alterações (Audit Log)</h2>
                <p className="text-slate-400 text-sm">Registro transacional completo de todas as alterações executadas nos registros do sistema.</p>
              </div>

              <div className="overflow-x-auto bg-slate-950 border border-slate-800 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase bg-slate-900/50">
                      <th className="p-4">Data/Hora</th>
                      <th className="p-4">Usuário</th>
                      <th className="p-4">Ação</th>
                      <th className="p-4">Detalhes do Log</th>
                      <th className="p-4">Endereço IP</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-slate-300 divide-y divide-slate-800 font-mono">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/40">
                        <td className="p-4 text-indigo-400 font-semibold whitespace-nowrap">{log.timestamp}</td>
                        <td className="p-4 font-bold text-slate-200">{log.userId}</td>
                        <td className="p-4 text-emerald-400">{log.action}</td>
                        <td className="p-4 text-slate-400">{log.details}</td>
                        <td className="p-4 text-slate-500">177.82.91.xx</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {}

      {/* Modal: Nova Ordem de Serviço */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-bold text-white">Abertura de Nova Ordem de Serviço</h3>
              <button onClick={() => setShowNewOrderModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Título da OS *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Vazamento barrilete bomba 2"
                    value={newOrderForm.title}
                    onChange={(e) => setNewOrderForm({...newOrderForm, title: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Tipo de Manutenção</label>
                  <select 
                    value={newOrderForm.type}
                    onChange={(e) => setNewOrderForm({...newOrderForm, type: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Corretiva">Corretiva</option>
                    <option value="Preventiva">Preventiva</option>
                    <option value="Projeto">Projeto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Sistema Predial *</label>
                  <select 
                    value={newOrderForm.systemId}
                    onChange={(e) => setNewOrderForm({...newOrderForm, systemId: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                  >
                    {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Prioridade</label>
                  <select 
                    value={newOrderForm.priority}
                    onChange={(e) => setNewOrderForm({...newOrderForm, priority: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Localização exata</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Subsolo, Torre B hall principal"
                    value={newOrderForm.location}
                    onChange={(e) => setNewOrderForm({...newOrderForm, location: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Prazo Técnico de Conclusão</label>
                  <input 
                    type="date" 
                    value={newOrderForm.dueDate}
                    onChange={(e) => setNewOrderForm({...newOrderForm, dueDate: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                  />
                </div>
              </div>

              {/* Status Selector triggers dynamic rules for 'Aguardando Retorno' */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Status Inicial</label>
                  <select 
                    value={newOrderForm.status}
                    onChange={(e) => setNewOrderForm({...newOrderForm, status: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                  >
                    <option value="a esclarecer">A Esclarecer</option>
                    <option value="Aguardando retorno">Aguardando retorno</option>
                    <option value="Em execução">Em execução</option>
                    <option value="Agendado">Agendado</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Custo Estimado (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 1200.00"
                    value={newOrderForm.estimatedCost}
                    onChange={(e) => setNewOrderForm({...newOrderForm, estimatedCost: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                  />
                </div>
              </div>

              {/* Regra de Negócio 5.2 - Conditional Fields for 'Aguardando retorno' */}
              {newOrderForm.status === 'Aguardando retorno' && (
                <div className="p-4 bg-amber-950/20 border border-amber-800/30 rounded-2xl space-y-3">
                  <span className="font-bold text-amber-400 block">Campos Obrigatórios de Retorno:</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                    <div>
                      <label className="text-slate-400 block mb-1">Quem responderá?</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Ontech Incêndio"
                        value={newOrderForm.contactTarget}
                        onChange={(e) => setNewOrderForm({...newOrderForm, contactTarget: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Último contato feito</label>
                      <input 
                        type="date" 
                        value={newOrderForm.lastContactDate}
                        onChange={(e) => setNewOrderForm({...newOrderForm, lastContactDate: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Próxima Cobrança</label>
                      <input 
                        type="date" 
                        value={newOrderForm.nextFollowUpDate}
                        onChange={(e) => setNewOrderForm({...newOrderForm, nextFollowUpDate: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Next Action (Rule 5.1 - Mandante) */}
              <div>
                <label className="text-slate-400 block mb-1 font-semibold text-rose-400">Próxima Ação Requerida *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Aguardar orçamento técnico detalhado do fornecedor x"
                  value={newOrderForm.nextAction}
                  onChange={(e) => setNewOrderForm({...newOrderForm, nextAction: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Descrição do Ocorrido / Escopo</label>
                <textarea 
                  rows={3}
                  value={newOrderForm.description}
                  onChange={(e) => setNewOrderForm({...newOrderForm, description: e.target.value})}
                  placeholder="Escreva detalhadamente o problema ou escopo técnico..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowNewOrderModal(false)}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Finalização / Comprovação de OS */}
      {showCompleteModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Encerrar com Comprovação</h3>
                <p className="text-xs text-indigo-400">{selectedOrder.code}: {selectedOrder.title}</p>
              </div>
              <button onClick={() => setShowCompleteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFinalizeOrderSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Data de Execução *</label>
                  <input 
                    type="date" 
                    required
                    value={completeForm.executionDate}
                    onChange={(e) => setCompleteForm({...completeForm, executionDate: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Executor / Fornecedor *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Clenir Bombas"
                    value={completeForm.executor}
                    onChange={(e) => setCompleteForm({...completeForm, executor: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Custo Final Fechado (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 1200.00"
                    value={completeForm.finalCost}
                    onChange={(e) => setCompleteForm({...completeForm, finalCost: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Garantia Técnica Até</label>
                  <input 
                    type="date" 
                    value={completeForm.warrantyUntil}
                    onChange={(e) => setCompleteForm({...completeForm, warrantyUntil: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                  />
                </div>
              </div>

              {/* Comprovação de Mídia / Evidência */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">Evidência / Fotografia anexada no R2</span>
                  <input 
                    type="checkbox" 
                    checked={completeForm.hasEvidence}
                    onChange={(e) => setCompleteForm({...completeForm, hasEvidence: e.target.checked})}
                    className="w-4 h-4 text-indigo-600 bg-slate-900 border-slate-800 rounded focus:ring-indigo-500"
                  />
                </div>

                {!completeForm.hasEvidence ? (
                  <div>
                    <label className="text-rose-400 block mb-1 font-semibold">Justificativa obrigatória da ausência de evidência *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Serviço interno no motor sem câmera"
                      value={completeForm.evidenceText}
                      onChange={(e) => setCompleteForm({...completeForm, evidenceText: e.target.value})}
                      className="w-full bg-slate-900 border border-rose-500/30 rounded-xl p-2.5 text-slate-200"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-900/30 text-[11px]">
                    <Paperclip className="w-4 h-4" />
                    <span>Arquivo de imagem simulado com upload pronto para o Cloudflare R2!</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Laudo / Descrição dos Trabalhos Concluídos</label>
                <textarea 
                  rows={2}
                  value={completeForm.description}
                  onChange={(e) => setCompleteForm({...completeForm, description: e.target.value})}
                  placeholder="Descreva exatamente o que foi executado..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowCompleteModal(false)}
                  className="bg-slate-950 border border-slate-800 px-4 py-2"
                >
                  Voltar
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 font-bold rounded-xl"
                >
                  Concluir e Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Visualizar Histórico Completo de uma OS */}
      {selectedOrder && !showCompleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Detalhamento e Histórico de Auditoria</h3>
                <span className="text-xs text-indigo-400 font-mono">{selectedOrder.code}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-sm">{selectedOrder.title}</h4>
                <p className="text-slate-400 leading-relaxed">{selectedOrder.description}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-2 text-[11px] text-slate-400 border-t border-slate-900">
                  <p>📍 <strong>Localização:</strong> {selectedOrder.location}</p>
                  <p>👤 <strong>Responsável Técnico:</strong> {selectedOrder.responsibleUserId}</p>
                  <p>📅 <strong>Abertura:</strong> {selectedOrder.openedAt.split('-').reverse().join('/')}</p>
                  <p>💰 <strong>Custo Estimado:</strong> R$ {selectedOrder.estimatedCost?.toLocaleString('pt-BR')}</p>
                </div>
              </div>

              {/* Histórico Interno de Eventos */}
              <div>
                <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-slate-400" />
                  Logs de Transação e Eventos da OS
                </h4>
                <div className="space-y-2 max-h-[180px] overflow-y-auto">
                  {selectedOrder.history.map((h, i) => (
                    <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <div className="flex justify-between text-[10px] text-slate-500 font-semibold mb-1">
                        <span>{h.date}</span>
                        <span>Por: {h.user}</span>
                      </div>
                      <p className="text-xs text-slate-300">{h.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-semibold"
              >
                Fechar Visualização
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
