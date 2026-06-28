// Contenido del caso "Expediente Vidal: La Última Story".
// Caso único, ficticio, ambientado en el Madrid actual.

export type EvidenceCategory =
  | 'forense'
  | 'digital'
  | 'financiero'
  | 'testimonio'
  | 'fisico'

export type EvidenceLocation =
  | 'escena'
  | 'edificio'
  | 'oficina'
  | 'comunicaciones'
  | 'coartadas'
  | 'documentos'

export interface Evidence {
  id: string
  phase: 1 | 2 | 3
  category: EvidenceCategory
  title: string
  summary: string
  content: string
  relatedSuspectIds: string[]
  // Se asigna en el servidor a partir de EVIDENCE_LOCATION (para la vista "mapa").
  location?: EvidenceLocation
}

// Ubicación o fuente de cada prueba, para reorganizarlas por lugar sin tocar el guion.
export const EVIDENCE_LOCATION: Record<string, EvidenceLocation> = {
  e01: 'escena',
  e02: 'escena',
  e03: 'escena',
  e20: 'escena',
  e11: 'edificio',
  e12: 'edificio',
  e16: 'edificio',
  e17: 'edificio',
  e22: 'edificio',
  e14: 'oficina',
  e19: 'oficina',
  e04: 'comunicaciones',
  e05: 'comunicaciones',
  e06: 'comunicaciones',
  e07: 'comunicaciones',
  e18: 'comunicaciones',
  e24: 'comunicaciones',
  e26: 'comunicaciones',
  e13: 'coartadas',
  e15: 'coartadas',
  e23: 'coartadas',
  e25: 'coartadas',
  e08: 'documentos',
  e09: 'documentos',
  e10: 'documentos',
  e21: 'documentos',
}

export interface SuspectResponse {
  evidenceId: string
  reaction: string
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
  // Reacciones al ser confrontado con una prueba concreta (interrogatorio dinámico).
  responses: SuspectResponse[]
}

export interface AccusationAxisOption {
  id: string
  label: string
}

export interface CaseSolution {
  guiltySuspectId: string
  // La acusación final reconstruye la teoría completa del crimen. Para acertar hay que
  // dar bien las TRES dimensiones (quién, cómo entró y por qué esa noche) Y aportar al
  // menos `minDecisive` pruebas del conjunto decisivo (no se exige ninguna en concreto).
  entryMethodId: string
  motiveId: string
  entryMethodOptions: AccusationAxisOption[]
  motiveOptions: AccusationAxisOption[]
  decisiveKeyEvidenceIds: string[]
  minDecisive: number
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

Tienes acceso a los informes, las comunicaciones recuperadas y las declaraciones de quienes estuvieron cerca de Helena en sus últimas semanas. Siete personas de su entorno tenían motivos para querer que Helena no contara lo que sabía, o lo que sentía. Solo una la empujó.`,
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
      responses: [
        {
          evidenceId: 'e09',
          reaction:
            '"Sí, quería vender mis acciones y ella me lo impedía. Estaba harto, no lo niego. Pero querer vender un papel no es querer matar a mi hermana."',
        },
        {
          evidenceId: 'e15',
          reaction:
            '"¿Lo ven? Pasé el control de pasaportes a las 00:47. Cuando aterricé, Helena ya estaba muerta. Es materialmente imposible, dejen de perder el tiempo conmigo."',
        },
        {
          evidenceId: 'e16',
          reaction:
            '"¿Una tarjeta maestra de socio? Yo heredé acciones, no soy socio operativo de nada. Nunca he tenido una de esas tarjetas, ni sabría por dónde se entra al edificio por detrás."',
        },
      ],
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
      responses: [
        {
          evidenceId: 'e05',
          reaction:
            '"Ese mensaje... Helena estaba paranoica con las cuentas, decía cosas así cuando se enfadaba. No le di importancia." (No niega haberlo recibido.)',
        },
        {
          evidenceId: 'e07',
          reaction:
            '"¿Mi teléfono en Chamberí? Pues... habré pasado por la zona en algún momento, no me acuerdo. ¿Y eso qué prueba?" (Se contradice con su declaración de que pasó toda la noche sola en casa, en Arganzuela.)',
        },
        {
          evidenceId: 'e08',
          reaction:
            '"Esa auditoría está sin terminar, hay partidas mal clasificadas. Cuando se revise con calma no habrá nada raro, ya lo verán."',
        },
        {
          evidenceId: 'e16',
          reaction:
            '"Sí, soy socia y tengo una de esas tarjetas. Como Helena. Que se usara una esa noche no significa que la usara yo." (Solo existían dos copias.)',
        },
        {
          evidenceId: 'e18',
          reaction:
            '"¿Una denuncia? No tenía ni idea de que Helena fuera a hacer algo así. A mí no me dijo nada." (Pero en su mensaje de las 18:32, Helena se lo había anunciado directamente.)',
        },
        {
          evidenceId: 'e26',
          reaction:
            '"¿Nadia ha dicho eso? Está histérica, se inventa cosas para quitarse el foco de encima. No hay ningún desvío." (Se tensa de forma evidente.)',
        },
      ],
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
      responses: [
        {
          evidenceId: 'e04',
          reaction:
            '"Sí, escribí esas barbaridades. Estaba hundido y bebido. Me avergüenzo, pero escribir una amenaza no es cumplirla. Ni siquiera me contestó."',
        },
        {
          evidenceId: 'e13',
          reaction:
            '"Ahí lo tienen: ocho alumnos y el registro del gimnasio. Estuve dando clase hasta pasadas las doce sin salir. Pregúntenles uno por uno."',
        },
        {
          evidenceId: 'e16',
          reaction:
            '"¿Tarjeta de socio de PulseFit? Yo soy su ex y entrenador, no tengo nada que ver con la empresa. No he pisado ese edificio en mi vida."',
        },
      ],
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
        'Descubrió recientemente que es avalista solidaria de una deuda de 95.000€ de Helena: si Helena se hundía o lo hacía público, Lucía respondía con su patrimonio. Se siente utilizada, arruinada y traicionada.',
      relatedEvidenceIds: ['e10', 'e14', 'e19', 'e20'],
      responses: [
        {
          evidenceId: 'e10',
          reaction:
            '"Firmé ese aval sin leerlo, confiando en ella. Me dejó la vida hipotecada con una firma. La odiaba por eso, ¿vale? Pero odiar a alguien no es tirarlo por un balcón."',
        },
        {
          evidenceId: 'e14',
          reaction:
            '"Mi tarjeta dice que entré a las siete y salí a la una. Estuve allí." (No menciona la salida trasera sin lector.)',
        },
        {
          evidenceId: 'e19',
          reaction:
            '"¿Que no me vieron una hora? Estaría en una sala, o bajé a fumar. Y sí, llevo una gabardina clara, como medio Madrid en marzo. ¿Eso me convierte en asesina?" (Nerviosa, sube el tono.)',
        },
        {
          evidenceId: 'e20',
          reaction:
            '"Pues claro que hay cosas mías en su casa: prácticamente vivía allí trabajando para ella. Esa acreditación lleva semanas perdida."',
        },
        {
          evidenceId: 'e16',
          reaction:
            '"¿Una tarjeta maestra de socia? Yo soy la asistente, no socia. Jamás me dieron una de esas; las tenían Helena y Claudia, y punto." (Confirma que no podía entrar por la puerta de servicio.)',
        },
      ],
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
      responses: [
        {
          evidenceId: 'e06',
          reaction:
            '"No sé de qué cuenta me habla. Yo no llevo ningún perfil anónimo." (Se pone a la defensiva y evita el contacto visual.)',
        },
        {
          evidenceId: 'e12',
          reaction:
            '"Ya lo declaré: oí voces y un golpe, y llamé al portero. No vi nada más." (Su versión es más corta de lo que cabría esperar.)',
        },
        {
          evidenceId: 'e17',
          reaction:
            '"Está bien, sí: la cuenta era mía. La odiaba por la farsa que vendía, pero yo no la toqué. Y lo que vi es verdad: una mujer con gabardina clara salió corriendo por la puerta de servicio poco antes de medianoche. No le vi la cara."',
        },
      ],
    },
    {
      id: 'tomas',
      name: 'Tomás Belmonte',
      age: 39,
      relation: 'Cofundador y director de tecnología de PulseFit',
      initial: 'T',
      statement:
        '"Helena y yo levantamos PulseFit juntos, pero llevábamos meses enfrentados por el rumbo del producto. ¿Que quería echarme? Que lo intentara. Esa noche estuve en una cena del sector, hay cien testigos y fotos con hora."',
      alibiClaim:
        'Dice que pasó la noche en una cena de tecnología con mucha gente y que hay fotos con marca de tiempo.',
      motiveHint:
        'Helena había preparado en secreto su despido y una demanda por filtrar la tecnología de PulseFit a una empresa rival. Si ella seguía adelante, Tomás lo perdía todo: puesto, acciones y reputación.',
      relatedEvidenceIds: ['e21', 'e22', 'e23'],
      responses: [
        {
          evidenceId: 'e21',
          reaction:
            '"¿Esos papeles de despido? Sí, me enteré de que Helena los estaba preparando y me hervía la sangre. Pero pelear por la empresa en los juzgados no es matar a nadie."',
        },
        {
          evidenceId: 'e22',
          reaction:
            '"Tengo llave de su piso, de cuando había confianza entre nosotros, y nunca se la devolví. Pero esa llave abre su puerta, no el portal ni la entrada de servicio del edificio."',
        },
        {
          evidenceId: 'e23',
          reaction:
            '"Salí de la cena pasadas las once y media y cogí un VTC al otro lado de la ciudad. Está en la aplicación: estuve lejísimos de Chamberí toda la noche."',
        },
        {
          evidenceId: 'e16',
          reaction:
            '"¿Tarjeta maestra de socio? Esa la tenían las administradoras, Helena y Claudia, por el control de finanzas y accesos. Los demás socios no pintábamos nada ahí."',
        },
      ],
    },
    {
      id: 'nadia',
      name: 'Nadia Cuevas',
      age: 33,
      relation: 'Directora de marketing y comunicación de PulseFit',
      initial: 'N',
      statement:
        '"Yo construí la imagen de PulseFit, y sí, esa imagen tenía mucho de humo. Si estallaba el escándalo, la culpa iba a caer sobre mí. Pero esa noche acabé en urgencias con un ataque de ansiedad, está todo registrado."',
      alibiClaim:
        'Dice que pasó la noche en el servicio de urgencias de un hospital por un ataque de ansiedad, con registro horario.',
      motiveHint:
        'Sabía que la marca exageraba sus resultados y temía que el escándalo que se avecinaba —y una posible denuncia de Helena— acabara con su carrera y la señalara como responsable del fraude publicitario.',
      relatedEvidenceIds: ['e24', 'e25', 'e26'],
      responses: [
        {
          evidenceId: 'e24',
          reaction:
            '"Claro que estaba aterrada. Un periodista iba a publicar que los resultados de PulseFit eran mentira, y Helena pensaba echarme a los leones para salvarse ella. Pero tener miedo no es empujar a nadie."',
        },
        {
          evidenceId: 'e25',
          reaction:
            '"Llamé a urgencias sobre las once, no podía respirar. Me atendieron y me tuvieron en observación hasta la madrugada. Pregunten en el hospital."',
        },
        {
          evidenceId: 'e26',
          reaction:
            '"¿Que si sabía lo del dinero? ...Sospechaba que Claudia se llevaba fondos, sí. Me callé porque le tenía miedo; no quería acabar yo también en su lista." (Mira de reojo, incómoda.)',
        },
        {
          evidenceId: 'e16',
          reaction:
            '"Yo soy de marketing, no socia. Nunca he tenido una de esas tarjetas maestras, ni falta que me hacía."',
        },
      ],
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
        'El sistema de control de acceso de las oficinas de PulseFit registra la entrada de Lucía Soto a las 19:02 y su salida a las 00:45, sin registrar ninguna salida intermedia. No obstante, el lector de tarjeta solo controla la puerta principal: las oficinas tienen una salida trasera sin lector, por la que se puede entrar y salir sin dejar registro. Las oficinas están a veinticinco minutos en coche del domicilio de Helena.',
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
        'Confrontado con las publicaciones de @verdad_pulsefit, Diego Marín admite ser el autor de la cuenta anónima, pero niega rotundamente tener relación con la muerte de Helena. Aporta un detalle que no había mencionado antes: poco antes de las 00:00, vio salir corriendo del edificio por la puerta de servicio a una mujer con una gabardina clara, que se alejó a pie en dirección a la calle principal. No pudo verle la cara.',
      relatedSuspectIds: ['diego', 'claudia', 'lucia', 'nadia'],
    },
    {
      id: 'e19',
      phase: 2,
      category: 'testimonio',
      title: 'Declaración de una compañera de oficina de Lucía',
      summary: 'Un hueco en la coartada de Lucía Soto.',
      content:
        'Una compañera que trabajaba esa noche en las oficinas de PulseFit declara que dejó de ver a Lucía en su puesto desde aproximadamente las 23:00 hasta cerca de la medianoche; dio por hecho que estaba "en alguna sala de reuniones". Comenta, sin darle importancia, que Lucía suele llevar una gabardina de color claro y que esa noche la tenía consigo.',
      relatedSuspectIds: ['lucia'],
    },
    {
      id: 'e20',
      phase: 3,
      category: 'fisico',
      title: 'Objeto personal hallado en el ático',
      summary: 'Una acreditación de PulseFit a nombre de Lucía Soto.',
      content:
        'Entre los objetos recogidos en el salón del ático de Helena aparece una acreditación de empleada de PulseFit a nombre de Lucía Soto. La cinta presenta una capa de polvo y no es posible datar con precisión cuándo quedó allí. Consta que Lucía acudía con frecuencia al domicilio de Helena por motivos de trabajo, también en los días previos al crimen.',
      relatedSuspectIds: ['lucia'],
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

    // AMPLIACIÓN — el círculo de PulseFit (Tomás y Nadia)
    {
      id: 'e21',
      phase: 2,
      category: 'financiero',
      title: 'Borrador de despido y demanda contra Tomás Belmonte',
      summary: 'Helena preparaba apartar a su cofundador.',
      content:
        'Entre los documentos de Helena aparece un borrador, fechado dos semanas antes de su muerte, para destituir a Tomás Belmonte como director de tecnología y demandarlo por presunta filtración del algoritmo de entrenamiento de PulseFit a una empresa competidora. De prosperar, Tomás perdería su puesto, buena parte de sus acciones y se enfrentaría a una indemnización millonaria.',
      relatedSuspectIds: ['tomas'],
    },
    {
      id: 'e22',
      phase: 2,
      category: 'testimonio',
      title: 'Tomás Belmonte conserva una llave del piso de Helena',
      summary: 'Acceso a la vivienda… pero no al edificio.',
      content:
        'Varios empleados confirman que Helena y Tomás fueron pareja años atrás y que él nunca devolvió la llave del ático. Esa llave abre la puerta de la vivienda de Helena, pero no el portal principal (con portero hasta las 22:00) ni la puerta de servicio del edificio, que se controla con tarjeta electrónica.',
      relatedSuspectIds: ['tomas'],
    },
    {
      id: 'e24',
      phase: 2,
      category: 'digital',
      title: 'Mensajes de Nadia Cuevas sobre el escándalo de marca',
      summary: 'Pánico ante una exclusiva periodística.',
      content:
        'Mensajes recuperados muestran a Nadia Cuevas, directora de marketing, alarmada porque un periodista preparaba un reportaje demostrando que los resultados "milagrosos" de PulseFit estaban falseados. En las conversaciones teme que Helena, para protegerse, la presente públicamente como la única responsable del fraude publicitario.',
      relatedSuspectIds: ['nadia'],
    },
    {
      id: 'e25',
      phase: 2,
      category: 'forense',
      title: 'Registro de urgencias hospitalarias de Nadia Cuevas',
      summary: 'Coartada médica de la directora de marketing.',
      content:
        'El servicio de urgencias de un hospital de Madrid registra el ingreso de Nadia Cuevas a las 23:09 por un cuadro de ansiedad aguda, con permanencia en observación hasta las 02:30. El horario está respaldado por la ficha de admisión y por el personal sanitario que la atendió.',
      relatedSuspectIds: ['nadia'],
    },
    {
      id: 'e23',
      phase: 3,
      category: 'digital',
      title: 'Coartada de Tomás: cena del sector y trayecto en VTC',
      summary: 'Dónde estuvo durante la franja del crimen.',
      content:
        'Fotografías con marca de tiempo sitúan a Tomás Belmonte en una cena tecnológica en el sur de Madrid hasta las 23:34. El registro de una aplicación de VTC muestra un trayecto a su nombre desde el restaurante hasta un domicilio del mismo distrito, con llegada a las 00:09. Resulta imposible que estuviera en Chamberí durante la franja de la muerte.',
      relatedSuspectIds: ['tomas'],
    },
    {
      id: 'e26',
      phase: 3,
      category: 'digital',
      title: 'Lo que Nadia Cuevas callaba sobre las cuentas',
      summary: 'Sabía del desvío de fondos.',
      content:
        'Confrontada con el reportaje, Nadia admite que desde hacía meses sospechaba que Claudia Ferrer desviaba dinero de PulseFit, pero calló por miedo. Su testimonio corrobora que el desvío era real y conocido en la cúpula de la empresa, y que Helena, al auditarlo en persona, se había convertido en una amenaza directa para quien lo orquestaba.',
      relatedSuspectIds: ['nadia', 'claudia'],
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
      time: '23:00',
      phase: 2,
      label: 'Una compañera deja de ver a Lucía Soto en su puesto de la oficina (hasta cerca de medianoche).',
    },
    {
      time: '23:09',
      phase: 2,
      label: 'Nadia Cuevas ingresa en urgencias por un ataque de ansiedad (en observación hasta las 02:30).',
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
      time: '23:34',
      phase: 3,
      label: 'Tomás Belmonte sigue en una cena del sector en el sur de Madrid; después coge un VTC lejos de Chamberí.',
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
    entryMethodId: 'servicio-tarjeta',
    motiveId: 'denuncia-desvio',
    entryMethodOptions: [
      {
        id: 'servicio-tarjeta',
        label: 'Por la puerta de servicio, usando una tarjeta maestra de socio',
      },
      { id: 'portal', label: 'Por el portal principal, a la vista del portero' },
      { id: 'dentro', label: 'Ya se encontraba dentro del edificio desde antes' },
      { id: 'incendios', label: 'Trepando por la escalera de incendios hasta el balcón' },
      { id: 'llave', label: 'Con una copia de la llave del piso de Helena' },
    ],
    motiveOptions: [
      {
        id: 'denuncia-desvio',
        label:
          'Helena iba a denunciarla por el desvío de fondos y contarlo todo en directo',
      },
      { id: 'herencia', label: 'La disputa por la herencia y el 20% de las acciones' },
      { id: 'deuda', label: 'Para librarse de la deuda de la que figuraba como avalista' },
      { id: 'acoso', label: 'Para que no se destapara la cuenta de acoso anónima' },
      { id: 'ruptura', label: 'Despecho y rabia tras la ruptura sentimental' },
      {
        id: 'despido-tomas',
        label: 'Para evitar que lo echaran de la empresa y lo demandaran por filtrar tecnología',
      },
      {
        id: 'fraude-marca',
        label: 'Para enterrar el escándalo de que los resultados de la marca eran un fraude',
      },
    ],
    // Conjunto de pruebas decisivas: basta con aportar `minDecisive` cualesquiera de
    // ellas (tarjeta de servicio, antena, auditoría, mensaje de voz o último mensaje
    // de Helena). No se obliga a ninguna prueba concreta para no penalizar teorías
    // igualmente válidas.
    decisiveKeyEvidenceIds: ['e16', 'e07', 'e08', 'e18', 'e05'],
    minDecisive: 3,
    explanation: `Claudia Ferrer mató a Helena Vidal: entró por la puerta de servicio con su tarjeta maestra de socia y la empujó esa misma noche porque Helena iba a denunciarla por el desvío de fondos y contarlo en directo al día siguiente.

POR QUÉ CLAUDIA
Móvil: la auditoría interna (E08) destapó que Claudia llevaba dos años desviando 180.000€ de PulseFit. Helena la firmó tres días antes y esa misma noche pensaba denunciarla y contarlo en directo, como dejó dicho a su abogado a las 23:15 (E18) y como ya había avisado a la propia Claudia esa tarde (E05).
Oportunidad: alguien entró por la puerta de servicio a las 23:38 con una tarjeta maestra de socio (E16). Solo existen dos copias: la de Helena y la de Claudia. Además, el móvil de Claudia estuvo conectado a antenas de Chamberí esa noche (E07), desmintiendo su coartada de "estar sola en casa". El forcejeo quedó grabado en la última story de Helena (E03) y terminó con un golpe en la cabeza y la caída.

POR QUÉ NO LUCÍA, AUNQUE LO PAREZCA
Lucía Soto es el señuelo perfecto: tenía un motivo real (es avalista de una deuda de 95.000€ de Helena, E10), su coartada de la oficina tiene un agujero porque hay una salida trasera sin control (E14) y una compañera dejó de verla durante la franja del crimen (E19), posee una gabardina clara como la que describió el testigo (E19, E17) e incluso apareció una acreditación suya en el ático (E20). Pero Lucía NO tiene una tarjeta maestra de socio: no pudo ser quien entró por la puerta de servicio a las 23:38. Su acreditación llevaba allí días —acudía a casa de Helena a trabajar— y la gabardina clara es una coincidencia: muchas personas tienen una.

LOS DEMÁS
Diego Marín era el autor de la cuenta anónima de acoso y un testigo incómodo (E17), pero no la mató. Marcos (control de pasaportes, E15) e Iván (registro y testigos del gimnasio, E13) tienen coartadas verificadas de forma independiente.

Tomás Belmonte, el cofundador, tenía un motivo de peso —Helena iba a echarlo y demandarlo (E21)— e incluso conservaba una llave del ático (E22). Pero esa llave abre la vivienda, no la puerta de servicio del edificio por la que entró el asesino, y su coartada (cena del sector y trayecto en VTC, E23) está confirmada durante toda la franja del crimen.

Nadia Cuevas temía el escándalo de marca y hasta sabía del desvío de fondos (E24, E26), lo que la hacía sospechosa; pero estuvo ingresada en urgencias desde las 23:09 (E25) y, al no ser socia, tampoco tenía tarjeta para entrar sin ser vista. Su testimonio, de hecho, confirma el móvil real: el desvío de Claudia existía y Helena se había convertido en una amenaza para quien lo orquestaba.`,
  },
}

export function getSuspect(id: string) {
  return CASE.suspects.find((s) => s.id === id)
}

export function getEvidence(id: string) {
  return CASE.evidence.find((e) => e.id === id)
}
