'use client';

const features = [
  {
    icon: '🤖',
    title: 'IA Integrada com GPT',
    description:
      'Geração automática de relatórios inteligentes usando GPT para análises profundas e insights precisos.',
  },
  {
    icon: '📊',
    title: 'Dashboards Interativos',
    description:
      'Visualizações dinâmicas e personalizáveis que se atualizam automaticamente com seus dados.',
  },
  {
    icon: '📈',
    title: 'Análises Avançadas',
    description:
      'Identifique tendências, padrões e oportunidades com nossas ferramentas de análise preditiva.',
  },
  {
    icon: '🔄',
    title: 'Automação Completa',
    description:
      'Relatórios agendados, atualizações automáticas e integração com seus sistemas existentes.',
  },
  {
    icon: '📱',
    title: 'Acesso Multiplataforma',
    description:
      'Acesse seus dados e relatórios de qualquer dispositivo, a qualquer hora, em qualquer lugar.',
  },
  {
    icon: '🔒',
    title: 'Segurança Avançada',
    description:
      'Proteção de dados com criptografia de ponta e controles de acesso granulares.',
  },
];

export default function Features() {
  return (
    <section id="recursos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recursos que{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              transformam
            </span>{' '}
            seu negócio
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nossa plataforma oferece tudo que você precisa para transformar
            dados em decisões estratégicas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-2 text-center md:text-left"
            >
              <div className="text-4xl mb-4 text-center md:text-left">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Pronto para revolucionar sua análise de dados?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Junte-se a centenas de empresas que já transformaram seus negócios
              com o Bie.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all w-full sm:w-auto">
                Começar Teste Gratuito
              </button>
              <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-lg w-full sm:w-auto">
                Agendar Demonstração
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
