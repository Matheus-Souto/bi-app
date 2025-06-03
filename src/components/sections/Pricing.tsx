'use client';

const plans = [
  {
    name: 'Bronze',
    price: 'Gratuito',
    description: 'Ideal para começar',
    popular: false,
    features: [
      '1 projeto de relatório ativo',
      'Geração de até 5 relatórios por mês com GPT',
      "Exportação em PDF limitada (marca d'água inclusa)",
      'Acesso a 1 tipos de modelos de relatório (ex: vendas)',
      'Sem suporte técnico direto (acesso apenas a FAQ e base de conhecimento)',
    ],
  },
  {
    name: 'Prata',
    price: 'R$ 79,90',
    description: 'Para pequenas empresas',
    popular: true,
    features: [
      'Até 3 projetos de relatório ativos',
      "Exportação em PDF e Excel (sem marca d'água)",
      'Templates personalizáveis',
      'Acesso a 1 tipos de modelos de relatório (ex: vendas)',
      'Suporte por e-mail em até 48h úteis',
      'Atualização automática de dashboards',
    ],
  },
  {
    name: 'Ouro',
    price: 'Valor a definir',
    description: 'Para grandes empresas',
    popular: false,
    features: [
      'Projetos e relatórios ilimitados',
      'Geração automática agendada (diária, semanal etc.)',
      'Geração avançada de imagens explicativas (infográficos com IA)',
      'Suporte dedicado via WhatsApp ou portal exclusivo',
      'Integração com sistemas ERP/CRM do cliente',
      'SLA prioritário',
    ],
  },
];

export default function Pricing() {
  return (
    <section id="planos" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Escolha o plano ideal para{' '}
            <span className="gradient-text">seu negócio</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Desde soluções gratuitas até recursos avançados para empresas. Todos
            os planos incluem nossa tecnologia de BI com GPT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border-2 p-8 card-hover ${
                plan.popular
                  ? 'border-blue-500 bg-blue-50 shadow-xl'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold gradient-text mb-2">
                  {plan.price}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                  plan.popular
                    ? 'btn-primary'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plan.name === 'Ouro' ? 'Contatar Vendas' : 'Começar Agora'}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Precisa de algo personalizado? Entre em contato conosco.
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Falar com especialista →
          </button>
        </div>
      </div>
    </section>
  );
}
