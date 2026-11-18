
import { ENVIO, TIENDA, PAGO_TRANSFERENCIA } from './config';

const money = (n) => `$${n.toLocaleString('es-MX')}`;

export const NOSOTROS = {
  historia: [
    'MAKA nació en Guadalajara como un proyecto personal de su fundadora, Maggy Reyes: una forma de compartir su gusto por los accesorios y de convivir con otras mujeres fuera de casa. Lo que empezó con unas cuantas piezas para amigas y mamás de la escuela creció gracias a la recomendación de boca en boca.',
    'Hoy MAKA ofrece más de cien modelos de collares, anillos, aretes, pulsos y piezas únicas, elegidos uno por uno para que cada clienta encuentre algo que vaya con su estilo, ya sea para el día a día o para regalar.',
  ],
  mision: 'Ofrecer joyería de moda accesible, bonita y de buena calidad, con una atención cercana y personal que haga sentir a cada clienta segura de su compra.',
  vision: 'Ser la marca de joyería de moda favorita de las mujeres jóvenes de Jalisco y llegar a todo México con una tienda en línea confiable, rápida y fácil de usar.',
  valores: [
    { titulo: 'Cercanía', texto: 'Atendemos a cada clienta como a una amiga: con paciencia, honestidad y buen trato.' },
    { titulo: 'Confianza', texto: 'Mostramos precios, materiales y disponibilidad reales, sin letras pequeñas.' },
    { titulo: 'Estilo', texto: 'Seleccionamos piezas en tendencia que se puedan combinar y usar todos los días.' },
    { titulo: 'Responsabilidad', texto: 'Cuidamos los datos de nuestras clientas y cumplimos lo que prometemos en cada entrega.' },
  ],
  politicaCalidad: [
    'Revisamos cada pieza antes de enviarla: broches, acabado, piedras y empaque.',
    'Indicamos con claridad el material de cada producto y si es hipoalergénico.',
    'Usamos fotografías propias para que la pieza que recibes sea la que viste.',
    'Si una pieza llega con defecto de fabricación, la cambiamos sin costo.',
    'Escuchamos las opiniones de nuestras clientas para mejorar el catálogo y el servicio.',
  ],
};

export const FAQ = [
  { tema: 'Envíos', preguntas: [
    { p: '¿Cuánto cuesta el envío?', r: `El envío a domicilio cuesta ${money(ENVIO.costoDomicilio)} y es gratis en compras desde ${money(ENVIO.gratisDesde)}. La recolección en un punto de entrega de Guadalajara no tiene costo.` },
    { p: '¿Cuánto tarda en llegar mi pedido?', r: `De ${ENVIO.diasLocal} y de ${ENVIO.diasNacional}.` },
    { p: '¿Puedo recoger mi pedido en persona?', r: 'Sí. En el checkout elige «Recoger en punto de entrega» y selecciona el punto y horario que te queden mejor.' },
  ] },
  { tema: 'Pagos', preguntas: [
    { p: '¿Qué formas de pago aceptan?', r: 'Por ahora transferencia bancaria y efectivo al recoger en un punto de entrega. El pago con tarjeta estará disponible pronto.' },
    { p: '¿Cuánto tiempo tengo para pagar por transferencia?', r: `Tus piezas quedan apartadas ${PAGO_TRANSFERENCIA.horasApartado} horas. Envía tu comprobante por WhatsApp antes de que venza el plazo; si no lo recibimos, el pedido se cancela y las piezas se liberan.` },
  ] },
  { tema: 'Cambios', preguntas: [
    { p: '¿Puedo cambiar una pieza?', r: 'Aplicamos cambio por defecto de fabricación dentro de los 7 días siguientes a la entrega. Por higiene, los aretes no tienen cambio.' },
    { p: '¿Quién paga el envío del cambio?', r: 'Si la pieza tiene defecto de fabricación, MAKA cubre el envío del cambio.' },
  ] },
  { tema: 'Materiales y cuidados', preguntas: [
    { p: '¿Las piezas son hipoalergénicas?', r: 'La mayoría son de acero inoxidable o plata .925 y son hipoalergénicas. En el detalle de cada producto indicamos el material.' },
    { p: '¿Cómo cuido mi joyería?', r: 'Evita perfume, cremas, cloro y agua; guárdala en su bolsa individual y límpiala con un paño suave y seco.' },
    { p: '¿Se despinta el baño de oro?', r: 'El acero con baño de oro de 18 k es resistente al uso diario. Con los cuidados anteriores conserva su color por más tiempo.' },
  ] },
];

export const CHAT_TEMAS = [
  { id: 'envios', etiqueta: 'Envíos', claves: ['envio', 'envío', 'llega', 'paqueteria', 'paquetería', 'domicilio', 'costo'], respuesta: FAQ[0].preguntas[0].r + ' ' + FAQ[0].preguntas[1].r },
  { id: 'recoger', etiqueta: 'Recoger en persona', claves: ['recoger', 'persona', 'punto', 'entrega'], respuesta: FAQ[0].preguntas[2].r },
  { id: 'pagos', etiqueta: 'Formas de pago', claves: ['pago', 'pagar', 'tarjeta', 'transferencia', 'efectivo'], respuesta: FAQ[1].preguntas[0].r + ' ' + FAQ[1].preguntas[1].r },
  { id: 'cambios', etiqueta: 'Cambios', claves: ['cambio', 'devol', 'defecto', 'garant'], respuesta: FAQ[2].preguntas[0].r },
  { id: 'materiales', etiqueta: 'Materiales', claves: ['material', 'alerg', 'acero', 'plata', 'oro', 'despint'], respuesta: FAQ[3].preguntas[0].r + ' ' + FAQ[3].preguntas[2].r },
  { id: 'horario', etiqueta: 'Horario', claves: ['horario', 'hora', 'abren', 'atienden'], respuesta: `Te atendemos por WhatsApp ${TIENDA.horario.toLowerCase()}.` },
];

export const LEGAL = {
  'aviso-de-privacidad': {
    titulo: 'Aviso de privacidad',
    actualizado: '17 de noviembre de 2026',
    secciones: [
      { t: '1. Identidad del responsable', p: `${TIENDA.nombre}, con domicilio en ${TIENDA.ciudad}, es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.` },
      { t: '2. Datos que recabamos', p: 'Nombre, correo electrónico, teléfono y dirección de entrega. No recabamos datos sensibles ni datos de tarjetas bancarias.' },
      { t: '3. Finalidades', p: 'Procesar y entregar tus pedidos, enviarte la confirmación y el seguimiento de tu compra, atender tus dudas y, si lo autorizas, enviarte avisos de disponibilidad de productos.' },
      { t: '4. Transferencias', p: 'Solo compartimos tu nombre, teléfono y dirección con la paquetería que entrega tu pedido.' },
      { t: '5. Derechos ARCO', p: `Puedes solicitar el acceso, rectificación, cancelación u oposición al uso de tus datos escribiendo a ${TIENDA.correo}. Responderemos en un plazo máximo de 20 días hábiles.` },
      { t: '6. Cambios al aviso', p: 'Cualquier cambio a este aviso se publicará en esta página con su fecha de actualización.' },
    ],
  },
  terminos: {
    titulo: 'Términos y condiciones',
    actualizado: '17 de noviembre de 2026',
    secciones: [
      { t: '1. Pedidos', p: 'Un pedido queda confirmado cuando recibes su número en la pantalla de confirmación. La existencia de cada pieza se verifica al confirmar el pedido.' },
      { t: '2. Precios', p: 'Los precios están en pesos mexicanos e incluyen IVA. Las promociones y códigos de descuento son válidos durante la vigencia indicada y no son acumulables.' },
      { t: '3. Pagos', p: `En pagos por transferencia, las piezas se apartan ${PAGO_TRANSFERENCIA.horasApartado} horas. Si no se recibe el comprobante en ese plazo, el pedido se cancela sin cargo.` },
      { t: '4. Entregas', p: `Envío a domicilio con costo de ${money(ENVIO.costoDomicilio)}, gratis desde ${money(ENVIO.gratisDesde)}. Recolección sin costo en los puntos de entrega publicados.` },
      { t: '5. Cambios y devoluciones', p: 'Aplica cambio por defecto de fabricación dentro de los 7 días posteriores a la entrega. Los aretes no tienen cambio por higiene.' },
    ],
  },
  'envios-y-devoluciones': {
    titulo: 'Envíos y devoluciones',
    actualizado: '17 de noviembre de 2026',
    secciones: [
      { t: 'Tiempos de entrega', p: `Zona metropolitana de Guadalajara: ${ENVIO.diasLocal.replace(' en la zona metropolitana de Guadalajara', '')}. Resto de México: ${ENVIO.diasNacional.replace(' al resto de México', '')}.` },
      { t: 'Costos de envío', p: `Envío a domicilio: ${money(ENVIO.costoDomicilio)}. Gratis en compras desde ${money(ENVIO.gratisDesde)}. Recolección en punto de entrega: sin costo.` },
      { t: 'Cambios', p: 'Si tu pieza llega con un defecto de fabricación, escríbenos por WhatsApp dentro de los 7 días siguientes con una foto y tu número de pedido. MAKA cubre el envío del cambio.' },
      { t: 'Excepciones', p: 'Por higiene, los aretes no tienen cambio. Las piezas únicas solo se cambian por defecto de fabricación.' },
    ],
  },
};
