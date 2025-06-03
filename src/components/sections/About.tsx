'use client';

export default function About() {
  return (
    <section
      id="sobre"
      className="py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-blue-50/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sobre a{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Bie
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Somos especialistas em transformar dados complexos em insights
            acionáveis, combinando inteligência artificial com experiência em
            Business Intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Nossa Missão
            </h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto lg:mx-0">
              Democratizar o acesso a análises avançadas de dados, permitindo
              que empresas de todos os tamanhos tomem decisões baseadas em
              informações precisas e insights inteligentes gerados por IA.
            </p>
            <div className="space-y-4 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-start text-left">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Inovação Constante
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Sempre na vanguarda das tecnologias de IA e análise de dados
                  </p>
                </div>
              </div>
              <div className="flex items-start text-left">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Simplicidade</h4>
                  <p className="text-gray-600 text-sm">
                    Transformamos complexidade em soluções simples e intuitivas
                  </p>
                </div>
              </div>
              <div className="flex items-start text-left">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Resultados Comprovados
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Historial de sucesso em projetos de diversos setores
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  500+
                </div>
                <p className="text-gray-600 text-sm">Projetos Entregues</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  50+
                </div>
                <p className="text-gray-600 text-sm">Clientes Satisfeitos</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  5+
                </div>
                <p className="text-gray-600 text-sm">Anos de Experiência</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  99%
                </div>
                <p className="text-gray-600 text-sm">Taxa de Satisfação</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
