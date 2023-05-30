export const surgeryNames = [
	'Aneurisma Cerebral',
	'Artrodese de coluna cervical',
	'Artrodese de coluna Lombo - sacra',
	'Artrodese coluna torácica',
	'Biópsia Estereotácica',
	'Bloqueio da coluna',
	'Bloqueio Ocipital',
	'Cranioplastia',
	'Canal estreito Lombar',
	'Carótida',
	'DBS',
	'DVP',
	'Desbridamento de FO',
	'Descompressão de Nervo Periférico',
	'DLP',
	'Escoliose',
	'Estapedectomia',
	'Extensos ferimentos',
	'Hérnia de disco Cervical',
	'Fogarty',
	'Janetta',
	'Hematoma Subdural Crônico',
	'Hérnia de disco Lombar',
	'HDL endoscópica',
	'Hérnia de disco torácica',
	'Laminoplastia cervical',
	'Laringectomia',
	'MAV',
	'MIcro Decorticação',
	'Micro de Laringe',
	'Paralisia Pregas Vocais',
	'Plexo braquial',
	'Punção Lombar',
	'Reconstrução Craniana',
	'Rinoplastia',
	'Septoplastia',
	'Terceiro ventriculostomia Endoscópica',
	'Tumor Cerebral',
	'Tumor de Coluna',
	'Tumor de Hipófise',
	'Tumor Medular',
	'Tumor de Nervo Periférico',
	'Túnel do Carpo',
	'Troca de gerador de DBS',
	'Timpanotomia',
	'Traqueostomia',
	'Vertebroplastia'
];
export const surgeonNames = [
	'Albert Brasil',
	'Alexandre Reis',
	'Alisson Teles',
	'Antonio Vial',
	'Bruno',
	'Cirurgia Torácica',
	'Craniofacial',
	'Jorge Kraemer',
	'Marcelo Ferreira',
	'Maria de Lourdes Villar Zeltzer',
	'Otorrino',
	'Paulo Worm',
	'Pedro Gobbato',
	'Roberto José Farias',
	'Rogerio Novaes',
	'Schuster',
	'Tielen Sigalles',
	'Tobias Ludwig'
];
export enum CurrentStep {
	Criacao = 'Enviado guias para a secretária',
	SolicitadoOPME = 'Solicitado orçamento OPME',
	RetornoOPME = 'Resposta da cotação OPME',
	DocsEnviadosConvenio = 'Encaminhado documentos para convênio',
	EnvioJustificativasOPME = 'Envio de justificativas OPME',
	RespostaConvenio = 'Resposta do convênio',
	EnvioJustificativas = 'Envio de Justificativas/documentos',
	RespostaJustificativas = 'Resposta após justificativa',
	Suspensa = 'Suspenso',
	Concluido = 'Concluído'
}
export const steps = [
	CurrentStep.Criacao,
	CurrentStep.SolicitadoOPME,
	CurrentStep.RetornoOPME,
	CurrentStep.EnvioJustificativasOPME,
	CurrentStep.RespostaConvenio,
	CurrentStep.EnvioJustificativas,
	CurrentStep.RespostaJustificativas,
	CurrentStep.Concluido
];
export enum ResponseStatus {
	Autorizada = 'Autorizado',
	NovasJustificativas = 'Necessita novas justificativas',
	Negada = 'Negado',
	AutorizadoIntegral = 'Autorizado integralmente',
	AutorizadoParcial = 'Autorizado parcialmente',
	NecessitaJustificativas = 'Necessita justificativa',
	EncaminhadoConvenio = 'Encaminhado para autorização do convênio',
	NecessitaJustificativasMaterial = 'Necessita justificativa do material'
}

const retornoOPMEMap = new Map<ResponseStatus, CurrentStep>();
retornoOPMEMap.set(ResponseStatus.EncaminhadoConvenio, CurrentStep.DocsEnviadosConvenio);
retornoOPMEMap.set(ResponseStatus.Negada, CurrentStep.Suspensa);
retornoOPMEMap.set(
	ResponseStatus.NecessitaJustificativasMaterial,
	CurrentStep.EnvioJustificativasOPME
);

const respostaConvenioMap = new Map<ResponseStatus, CurrentStep>();
respostaConvenioMap.set(ResponseStatus.AutorizadoParcial, CurrentStep.Concluido);
respostaConvenioMap.set(ResponseStatus.AutorizadoIntegral, CurrentStep.Concluido);
respostaConvenioMap.set(ResponseStatus.NecessitaJustificativas, CurrentStep.EnvioJustificativas);

const respostaJustificativasMap = new Map<ResponseStatus, CurrentStep>();
respostaJustificativasMap.set(ResponseStatus.NovasJustificativas, CurrentStep.EnvioJustificativas);
respostaJustificativasMap.set(ResponseStatus.Negada, CurrentStep.Suspensa);
respostaJustificativasMap.set(ResponseStatus.AutorizadoIntegral, CurrentStep.Concluido);
respostaJustificativasMap.set(ResponseStatus.AutorizadoParcial, CurrentStep.Concluido);

export const nextStepMap = new Map<CurrentStep, typeof retornoOPMEMap | CurrentStep>();

nextStepMap.set(CurrentStep.SolicitadoOPME, CurrentStep.RetornoOPME);
nextStepMap.set(CurrentStep.RetornoOPME, retornoOPMEMap);
nextStepMap.set(CurrentStep.EnvioJustificativasOPME, CurrentStep.RetornoOPME);
nextStepMap.set(CurrentStep.DocsEnviadosConvenio, CurrentStep.RespostaConvenio)
nextStepMap.set(CurrentStep.RespostaConvenio, respostaConvenioMap);
nextStepMap.set(CurrentStep.EnvioJustificativas, CurrentStep.RespostaJustificativas);
nextStepMap.set(CurrentStep.RespostaJustificativas, respostaJustificativasMap);
