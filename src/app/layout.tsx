import Head from 'next/head';
import React, { ReactNode } from 'react';

import './styles/layout.scss';  // Importe seus estilos SCSS
import './styles/globals.scss';  // Importe seus estilos SCSS

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="pt-BR">
      <Head>
      <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Perfil profissional de Hélio Martins - Engenheiro de Software e Eng Mecânico. Saiba mais sobre seus projetos, habilidades, Projetos, experiências e muito mais."
        />
        <meta
          name="keywords"
          content="Hélio Martins, Desenvolvedor, Engenheiro de Software, Engenheiro Mecânico, Programação, Projetos, Tecnologia, Portfólio"
        />
        <meta name="author" content="Hélio Martins" />
        <meta property="og:title" content="Hélio Martins - Estudante de Eng Mecânica e Eng de Software" />
        <meta
          property="og:description"
          content="Descubra os projetos e habilidades de Hélio Martins, um apaixonado por inovação e tecnologia."
        />
        <meta property="og:image" content="/images/profile-og-image.png" />
        <meta property="og:url" content="https://profile-bxy80z11q-heliopmarts-projects.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />

        <title>Hélio Martins - Eng de Software | Eng Mecânico</title>

        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <body>
        {children}
      </body>
    </html>
  );
};

export default Layout;
