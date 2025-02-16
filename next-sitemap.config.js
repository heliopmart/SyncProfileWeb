module.exports = {
    siteUrl: "https://profile-web-git-main-heliopmarts-projects.vercel.app", // Substitua pelo seu domínio real se for diferente
    generateRobotsTxt: true, // Gera também um arquivo robots.txt
    sitemapSize: 5000, // Garante que o sitemap inclua todas as páginas
    exclude: ["/404"], // Exclui páginas desnecessárias, como erro 404
    changefreq: "daily", // Define a frequência de atualização
    priority: 0.7,
  };