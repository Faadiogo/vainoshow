
import React from 'react';

const RulesTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Regras e Restrições</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>Não é permitida a entrada com bebidas ou alimentos.</li>
        <li>Proibida a entrada de menores de 18 anos desacompanhados.</li>
        <li>Obrigatória apresentação de documento com foto.</li>
        <li>Não é permitido fumar no local do evento.</li>
        <li>A entrada será permitida até 1 hora após o início do evento.</li>
      </ul>
    </div>
  );
};

export default RulesTab;
