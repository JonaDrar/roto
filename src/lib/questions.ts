
export type Question = {
  id: number;
  text: string;
};

export const questions: Question[] = [
  { id: 1, text: "¿Sientes que a menudo tus necesidades emocionales no son escuchadas?" },
  { id: 2, text: "¿Te resulta difícil pedir ayuda cuando la necesitas?" },
  { id: 3, text: "¿Minimizas tus propios sentimientos para no molestar a otros?" },
  { id: 4, text: "¿Sientes un vacío persistente, incluso cuando estás rodeado de gente?" },
  { id: 5, text: "¿Te criticas duramente por tus errores?" },
  { id: 6, text: "¿Evitas el conflicto a toda costa, incluso si significa sacrificar tus deseos?" },
  { id: 7, text: "¿Te sientes culpable por dedicar tiempo a ti mismo/a?" },
  { id: 8, text: "¿Crees que no mereces, en el fondo, amor o felicidad plena?" },
  { id: 9, text: "¿Te cuesta establecer límites saludables en tus relaciones?" },
  { id: 10, text: "¿Comparas constantemente tu vida con la de los demás, sintiéndote inferior?" },
  { id: 11, text: "¿Sientes que tienes que 'ganarte' el afecto o la aprobación de los demás?" },
  { id: 12, text: "¿Te sientes desconectado/a de tus propias emociones la mayor parte del tiempo?" },
];

export const TOTAL_QUESTIONS = questions.length;
