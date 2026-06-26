// Contenido del caso "Expediente Vidal: La Última Story".
// Caso único, ficticio, ambientado en el Madrid actual.

export type EvidenceCategory =
  | 'forense'
  | 'digital'
  | 'financiero'
  | 'testimonio'
  | 'fisico'

export interface Evidence {
  id: string
  phase: 1 | 2 | 3
  category: EvidenceCategory
  title: string
  summary: string
  content: string
  relatedSuspectIds: string[]
}

export interface Suspect {
  id: string
  name: string
  age: number
  relation: string
  initial: string
  statement: string
  alibiClaim: string
  motiveHint: string
  relatedEvidenceIds: string[]
}

export interface CaseSolution {
  guiltySuspectId: string
  validKeyEvidenceIds: string[]
  explanation: string
}

export interface TimelineEvent {
  time: string
  phase: 1 | 2 | 3
  label: string
}

export interface CaseData {
  title: string
  tagline: string
  briefing: string
  victim: {
    name: string
    age: number
    occupation: string
    description: string
    deathSummary: string
  }
  suspects: Suspect[]
  evidence: Evidence[]
  timeline: TimelineEvent[]
  hints: string[]
  solution: CaseSolution
}

export const CASE: CaseData = {
  title: 'Expediente Vidal: La Última Story',
  tagline: 'Una influencer del fitness cae desde su propio balcón. ¿Accidente, o algo que ella misma grabó sin saberlo?',
  briefing: `Madrugada del sábado 14 de marzo. Helena Vidal Soler, de 34 años, cofundadora y rostro visible de PulseFit —una de las apps de entrenamiento personal más populares de España, con más de dos millones de seguidores— es hallada muerta en el patio interior de su edificio, en el barrio de Chamberí, Madrid. Todo apunta a una caída desde el balcón de su ático.

El primer aviso lo da un vecino tras oír un golpe seco hacia la medianoche. Cuando llega la policía, el móvil de Helena sigue en el suelo del balcón: estaba grabando una "story" en directo para sus seguidores cuando ocurrió algo. La grabación se corta de golpe a las 23:52.

Lo que en un primer momento parecía un trágico accidente —o incluso un suicidio, dada la presión mediática que arrastraba Helena— empieza a desmoronarse en cuanto el forense examina el cuerpo. Te han llamado a ti, como investigador o investigadora independiente contratada por la familia, para revisar el expediente antes de que el caso se cierre como accidente.

Tienes acceso a los informes, las comunicaciones recuperadas y las declaraciones de quienes estuvieron cerca de Helena en sus últimas semanas. Cinco personas tenían motivos para querer que Helena no contara lo que sabía, o lo que sentía. Solo una la empujó.`,
  victim: {
    name: 'Helena Vidal Soler',
    age: 34,
    occupation: 'Cofundadora y CEO de PulseFit',
    description:
      'Antigua atleta de triatlón convertida en empresaria e influencer del fitness. Carismática en público, exigente y desconfiada en privado. En las últimas semanas había estado especialmente tensa, según varios testigos, y había empezado a revisar las cuentas de la empresa en persona.',
    deathSummary:
      'Cae desde el balcón de su ático (4º) al patio interior del edificio. La autopsia preliminar fija la hora de la muerte entre las 23:40 y las 00:10. Presenta un golpe contundente en la zona posterior de la cabeza, producido antes de la caída.',
  },
  suspects: [
    {
      id: 'marcos',
      name: 'Marcos Vidal Soler',
      age: 37,
      relation: 'Hermano de Helena',
      initial: 'M',
      statement:
        '"Helena y yo llevábamos meses sin hablarnos bien, sí. Pero yo estaba en Lisboa por trabajo, aterricé en Madrid pasada la medianoche. Pregunten en el aeropuerto, está todo registrado."',
      alibiClaim: 'Dice que volaba de Lisboa a Madrid esa noche y que aterrizó después de la hora del crimen.',
      motiveHint:
        'Hereda junto a Helena el piso de sus padres y un 20% de las acciones de PulseFit. Helena bloqueaba sistemáticamente su intento de vender esa participación.',
      relatedEvidenceIds: ['e09', 'e15'],
    },
    {
      id: 'claudia',
      name: 'Claudia Ferrer',
      age: 35,
      relation: 'Socia y directora financiera de PulseFit',
      initial: 'C',
      statement:
        '"Esa noche estuve en casa, sola, viendo una serie. No tengo a nadie que lo confirme porque vivo sola, pero es la verdad. Lo de las cuentas... eso lo podemos hablar con calma, no es lo que parece."',
      alibiClaim: 'Dice que pasó toda la noche sola en su casa, sin testigos que lo confirmen.',
      motiveHint:
        'Como directora financiera, es la única persona junto a Helena con acceso a las cuentas de socios de la empresa. En las últimas semanas, Helena había empezado a auditar personalmente las finanzas de PulseFit.',
      relatedEvidenceIds: ['e05', 'e07', 'e08', 'e16', 'e17'],
    },
    {
      id: 'ivan',
      name: 'Iván Roces',
      age: 36,
      relation: 'Ex pareja de Helena, entrenador personal',
      initial: 'I',
      statement:
        '"Sí, le escribí cosas que no debí escribir. Estaba dolido, llevábamos dos meses separados y ella ya estaba como si nada. Pero esa noche di clase en el gimnasio hasta tarde, había ocho personas allí. Pregúntenles a ellos."',
      alibiClaim: 'Dice que impartió una clase nocturna en su gimnasio hasta las 00:30, con varios alumnos presentes.',
      motiveHint:
        'Ruptura reciente y tóxica. Le envió mensajes amenazantes la misma noche del crimen, horas antes de la hora estimada de la muerte.',
      relatedEvidenceIds: ['e04', 'e13'],
    },
    {
      id: 'lucia',
      name: 'Lucía Soto',
      age: 28,
      relation: 'Asistente personal de Helena',
      initial: 'L',
      statement:
        '"Helena me hizo firmar como avalista de un préstamo suyo hace un año, diciéndome que era un trámite sin importancia. Hace poco entendí lo que había firmado realmente. Pero esa noche estuve trabajando en la oficina hasta tarde, mi tarjeta de acceso lo demuestra."',
      alibiClaim: 'Dice que estuvo trabajando hasta tarde en las oficinas de PulseFit, fichando con su tarjeta de empleada.',
      motiveHint:
        'Descubrió recientemente que es avalista legal de una deuda personal de Helena que no entendía del todo cuando firmó. Se siente utilizada y expuesta legalmente.',
      relatedEvidenceIds: ['e10', 'e14'],
    },
    {
      id: 'diego',
      name: 'Diego Marín',
      age: 41,
      relation: 'Vecino del piso inferior',
      initial: 'D',
      statement:
        '"Yo solo soy el vecino de abajo. Oí ruido esa noche, miré por la ventana, vi algo, y llamé al portero. Eso es todo lo que sé."',
      alibiClaim: 'Dice que estaba en su propio piso toda la noche y que solo fue testigo de algo desde su ventana.',
      motiveHint:
        'Hay rumores de un perfil anónimo en redes sociales dedicado a "destapar" a Helena como un fraude del bienestar. Nadie ha confirmado quién está detrás.',
      relatedEvidenceIds: ['e06', 'e12'],
    },
  ],
  evidence: [
    // FASE 1 — la escena y lo evidente
    {
      id: 'e01',
      phase: 1,
      category: 'forense',
      title: 'Informe preliminar de autopsia',
      summary: 'Hora de la muerte y causa del golpe.',
      content:
        'La muerte se produjo por traumatismo múltiple compatible con una caída desde aproximadamente 12 metros de altura. Sin embargo, se observa una contusión en la región occipital (parte posterior de la cabeza) con un patrón de golpe contundente, producida ANTES de la caída según la coloración del hematoma. Esta lesión es incompatible con el impacto contra el suelo del patio. Hora estimada de la muerte: entre las 23:40 y las 00:10.',
      relatedSuspectIds: [],
    },
    {
      id: 'e02',
      phase: 1,
      category: 'fisico',
      title: 'Informe de la escena del crimen',
      summary: 'El balcón y el estado del cuerpo.',
      content:
        'El balcón del ático presenta la barandilla intacta, sin signos de rotura. Se hallan marcas de arrastre en el suelo del balcón y una maceta volcada, compatibles con un forcejeo previo a la caída. El móvil de la víctima se encontró en el suelo del balcón, con la cámara aún activa en modo "directo".',
      relatedSuspectIds: [],
    },
    {
      id: 'e03',
      phase: 1,
      category: 'digital',
      title: 'Análisis de la grabación en directo',
      summary: 'La story se corta de golpe a las 23:52.',
      content:
        'La transmisión en directo de Helena, dirigida a sus seguidores, se interrumpe abruptamente a las 23:52. En los últimos ocho segundos de audio se distinguen dos voces discutiendo, una de ellas femenina, seguidas de un golpe y un grito corto. El audio es demasiado confuso para identificar con certeza a la segunda voz a partir solo de esta grabación.',
      relatedSuspectIds: [],
    },
    {
      id: 'e04',
      phase: 1,
      category: 'digital',
      title: 'Mensajes de Iván Roces a Helena',
      summary: 'Amenaza enviada la misma noche, a las 22:50.',
      content:
        '22:50 — Iván: "Sigues haciendo como si no hubiera pasado nada. Vas a arrepentirte de cómo me dejaste, te lo prometo." \n22:51 — Iván: "No me ignores, Helena."\nHelena no respondió a estos mensajes.',
      relatedSuspectIds: ['ivan'],
    },
    {
      id: 'e11',
      phase: 1,
      category: 'testimonio',
      title: 'Declaración del portero del edificio',
      summary: 'Quién entró y salió por el portal principal.',
      content:
        'El portero, de servicio hasta las 22:00, afirma que durante su turno no vio a nadie ajeno al edificio entrar a visitar a la señorita Vidal. Señala que el edificio cuenta con una entrada de servicio en la parte trasera, sin cámara, utilizada por el personal de limpieza y por algunos vecinos con acceso mediante tarjeta electrónica.',
      relatedSuspectIds: [],
    },
    {
      id: 'e12',
      phase: 1,
      category: 'testimonio',
      title: 'Declaración inicial de Diego Marín',
      summary: 'El vecino que dio la alerta.',
      content:
        'Diego Marín, vecino del piso inferior, declara que sobre las 23:50 escuchó voces alteradas en el piso de arriba, seguidas de un golpe. Asegura no haber visto nada relevante y haber llamado al portero "por precaución". Su declaración es notablemente breve y evasiva.',
      relatedSuspectIds: ['diego'],
    },

    // FASE 2 — los motivos
    {
      id: 'e05',
      phase: 2,
      category: 'digital',
      title: 'Último mensaje de Helena a Claudia Ferrer',
      summary: 'Enviado esa misma tarde, a las 18:32.',
      content:
        '18:32 — Helena: "Mañana lo cuento todo. A la junta y en directo. Se acabó, Claudia. Ya no hay vuelta atrás."\nClaudia no respondió por escrito a este mensaje.',
      relatedSuspectIds: ['claudia'],
    },
    {
      id: 'e06',
      phase: 2,
      category: 'digital',
      title: 'Publicaciones de la cuenta anónima @verdad_pulsefit',
      summary: 'Un perfil dedicado a acosar a Helena en redes.',
      content:
        'Desde hace ocho meses, una cuenta anónima publica capturas y comentarios acusando a Helena de "vender un cuerpo perfecto falso" y de "estafar a sus seguidoras". Los horarios de publicación coinciden sistemáticamente con las franjas en las que Diego Marín, según su propio testimonio, se encontraba en casa. La cuenta dejó de publicar la noche del crimen y no ha vuelto a hacerlo desde entonces.',
      relatedSuspectIds: ['diego'],
    },
    {
      id: 'e07',
      phase: 2,
      category: 'digital',
      title: 'Registro de antena de telefonía de Claudia Ferrer',
      summary: 'Ubicación de su móvil la noche del crimen.',
      content:
        'Los registros de la operadora muestran que el teléfono de Claudia Ferrer estuvo conectado a antenas de la zona de Chamberí entre las 23:15 y las 00:20, a pocas calles del domicilio de Helena. Claudia vive en el barrio de Arganzuela, a más de cuarenta minutos en coche.',
      relatedSuspectIds: ['claudia'],
    },
    {
      id: 'e09',
      phase: 2,
      category: 'financiero',
      title: 'Documento de herencia y reparto de acciones',
      summary: 'La disputa entre Helena y Marcos.',
      content:
        'Tras el fallecimiento de sus padres, Helena y Marcos heredaron a partes iguales un piso en Madrid y, además, Marcos recibió un 20% de las acciones de PulseFit que originalmente pertenecían a su padre, inversor inicial de la empresa. Marcos ha solicitado en tres ocasiones documentadas vender su participación a un fondo externo; Helena, como socia mayoritaria, ha bloqueado la operación cada vez alegando "proteger la visión de marca".',
      relatedSuspectIds: ['marcos'],
    },
    {
      id: 'e10',
      phase: 2,
      category: 'financiero',
      title: 'Contrato de préstamo personal de Helena',
      summary: 'Lucía Soto figura como avalista.',
      content:
        'Hace catorce meses, Helena Vidal firmó un préstamo personal de 95.000€ con una entidad privada para cubrir gastos no declarados de PulseFit. El contrato incluye la firma de Lucía Soto como avalista solidaria. Según el documento, en caso de impago, Lucía respondería legalmente con su patrimonio personal.',
      relatedSuspectIds: ['lucia'],
    },
    {
      id: 'e13',
      phase: 2,
      category: 'testimonio',
      title: 'Declaración de alumnos del gimnasio de Iván',
      summary: 'Confirmación de la clase nocturna.',
      content:
        'Cinco de los ocho alumnos inscritos en la clase de las 22:00 confirman, de forma independiente, que Iván Roces impartió la sesión completa hasta aproximadamente las 00:20, sin ausentarse en ningún momento. El registro de acceso del gimnasio respalda estos horarios.',
      relatedSuspectIds: ['ivan'],
    },
    {
      id: 'e14',
      phase: 2,
      category: 'fisico',
      title: 'Registro de acceso de empleada — Lucía Soto',
      summary: 'Tarjeta de fichaje en las oficinas de PulseFit.',
      content:
        'El sistema de control de acceso de las oficinas de PulseFit registra la entrada de Lucía Soto a las 19:02 y su salida a las 00:45, sin registrar ninguna salida intermedia. Las oficinas están a veinticinco minutos en coche del domicilio de Helena.',
      relatedSuspectIds: ['lucia'],
    },
    {
      id: 'e15',
      phase: 2,
      category: 'fisico',
      title: 'Tarjeta de embarque y control de pasaportes de Marcos',
      summary: 'Vuelo Lisboa–Madrid.',
      content:
        'El registro de control de pasaportes del aeropuerto de Madrid confirma que Marcos Vidal pasó el control de llegadas a las 00:47, tras un vuelo que aterrizó a las 23:50 con retraso. Resulta materialmente imposible que se encontrara en Chamberí antes de la 01:15.',
      relatedSuspectIds: ['marcos'],
    },

    // FASE 3 — las pruebas decisivas
    {
      id: 'e08',
      phase: 3,
      category: 'financiero',
      title: 'Auditoría interna de PulseFit',
      summary: 'Desvío de fondos durante dos años.',
      content:
        'Una auditoría encargada por Helena en las últimas semanas revela transferencias irregulares por un total de 180.000€ desde cuentas de PulseFit hacia una cuenta personal a nombre de Claudia Ferrer, realizadas de forma fraccionada durante los últimos dos años. La auditoría está fechada y firmada por Helena tres días antes de su muerte.',
      relatedSuspectIds: ['claudia'],
    },
    {
      id: 'e16',
      phase: 3,
      category: 'fisico',
      title: 'Registro de la llave electrónica de la puerta de servicio',
      summary: 'Quién entró al edificio a las 23:38.',
      content:
        'El sistema de la puerta de servicio del edificio (sin cámara) registra el uso de una tarjeta maestra de socios de PulseFit a las 23:38 de la noche del crimen. Esa tarjeta maestra solo existe en dos copias: una en posesión de Helena Vidal, y otra en posesión de Claudia Ferrer.',
      relatedSuspectIds: ['claudia'],
    },
    {
      id: 'e17',
      phase: 3,
      category: 'fisico',
      title: 'Declaración ampliada de Diego Marín',
      summary: 'Lo que realmente vio esa noche.',
      content:
        'Confrontado con las publicaciones de @verdad_pulsefit, Diego Marín admite ser el autor de la cuenta anónima, pero niega rotundamente tener relación con la muerte de Helena. Aporta un detalle que no había mencionado antes: poco antes de las 00:00, vio salir corriendo del edificio por la puerta de servicio a una mujer con una gabardina clara, que se alejó a pie en dirección a la calle principal.',
      relatedSuspectIds: ['diego', 'claudia'],
    },
    {
      id: 'e18',
      phase: 3,
      category: 'digital',
      title: 'Mensaje de voz de Helena a su abogado',
      summary: 'Grabado a las 23:15, la noche del crimen.',
      content:
        '"Necesito que prepares los papeles de la denuncia contra Claudia para mañana a primera hora, lo de la auditoría y las transferencias. Pero antes quiero decírselo a la cara, esta misma noche. Se merece saber que esto se acaba aquí, antes de que lo cuente en directo."',
      relatedSuspectIds: ['claudia'],
    },
  ],
  timeline: [
    {
      time: '18:32',
      phase: 2,
      label: 'Helena avisa por mensaje a Claudia Ferrer de que "mañana lo cuenta todo".',
    },
    {
      time: '19:02',
      phase: 2,
      label: 'Lucía Soto ficha su entrada en las oficinas de PulseFit.',
    },
    {
      time: '22:00',
      phase: 2,
      label: 'Iván Roces empieza su clase nocturna en el gimnasio (termina hacia las 00:20).',
    },
    {
      time: '22:50',
      phase: 1,
      label: 'Iván Roces envía mensajes amenazantes a Helena, que no responde.',
    },
    {
      time: '23:15',
      phase: 3,
      label: 'Helena deja un mensaje de voz a su abogado pidiéndole preparar una denuncia.',
    },
    {
      time: '23:15',
      phase: 2,
      label: 'El móvil de Claudia Ferrer empieza a conectar con antenas de Chamberí (hasta las 00:20).',
    },
    {
      time: '23:38',
      phase: 3,
      label: 'Una tarjeta maestra de socio de PulseFit abre la puerta de servicio del edificio.',
    },
    {
      time: '23:40',
      phase: 1,
      label: 'Comienza la horquilla de la hora de la muerte según la autopsia (hasta las 00:10).',
    },
    {
      time: '23:50',
      phase: 1,
      label: 'Un vecino oye voces alteradas y un golpe en el ático de Helena.',
    },
    {
      time: '23:52',
      phase: 1,
      label: 'La retransmisión en directo de Helena se corta de golpe.',
    },
    {
      time: '00:00',
      phase: 3,
      label: 'Diego Marín ve salir a una mujer con gabardina clara por la puerta de servicio.',
    },
    {
      time: '00:45',
      phase: 2,
      label: 'Lucía Soto ficha su salida de las oficinas de PulseFit.',
    },
    {
      time: '00:47',
      phase: 2,
      label: 'Marcos Vidal pasa el control de pasaportes en el aeropuerto de Madrid.',
    },
  ],
  hints: [
    'Empieza por la autopsia: el golpe en la cabeza se produjo ANTES de la caída, así que no fue ni un accidente ni un suicidio. El portero no vio entrar a nadie por el portal principal… pero hay una puerta de servicio sin cámara. La pregunta clave es cómo entró el culpable sin ser visto.',
    'Casi todos tienen un motivo. La pregunta útil no es "¿quién querría hacerlo?" sino "¿quién pudo?". Separa las coartadas que se apoyan en un registro independiente (control de pasaportes, registro del gimnasio, fichaje de la oficina) de las que se sostienen solo en la palabra del propio sospechoso.',
    'Cruza dos cosas: quién estuvo físicamente cerca del edificio esa noche y quién tenía una forma de entrar sin ser visto. Y desconfía de los señuelos: el sospechoso con el comportamiento más turbio o el motivo más escandaloso no tiene por qué ser quien la empujó.',
  ],
  solution: {
    guiltySuspectId: 'claudia',
    validKeyEvidenceIds: ['e16', 'e08', 'e18', 'e17', 'e07', 'e05'],
    explanation: `Claudia Ferrer es la responsable de la muerte de Helena Vidal.

Tras descubrir el desvío de 180.000€ (auditoría interna, prueba E08), Helena decidió confrontarla en persona esa misma noche antes de denunciarla legalmente y hacerlo público al día siguiente, como anunció a su abogado en el mensaje de voz de las 23:15 (E18) y como ya le había advertido por escrito a la propia Claudia esa tarde (E05).

Claudia entró al edificio por la puerta de servicio a las 23:38 usando su tarjeta maestra de socia (E16), la única alternativa a la de Helena. Su teléfono confirma que estuvo en la zona de Chamberí esa noche, lejos de la coartada de "quedarse en casa" que ella misma dio (E07). La discusión se grabó parcialmente en la última story en directo de Helena (E03): el forcejeo terminó con un golpe en la cabeza y la caída desde el balcón.

Diego Marín, el vecino, vio salir corriendo a una mujer con gabardina clara por esa misma puerta de servicio justo después de la hora del crimen (E17): no es el asesino, sino un acosador anónimo y testigo involuntario.

Los otros tres sospechosos —Marcos, Iván y Lucía— tenían motivos reales, pero sus coartadas resisten la verificación cruzada con pruebas materiales independientes: el control de pasaportes del aeropuerto (E15), el registro y los testigos del gimnasio (E13), y la tarjeta de fichaje de la oficina (E14).`,
  },
}

export function getSuspect(id: string) {
  return CASE.suspects.find((s) => s.id === id)
}

export function getEvidence(id: string) {
  return CASE.evidence.find((e) => e.id === id)
}
