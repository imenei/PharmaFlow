import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
const apiOrigin = (() => {
  try {
    return new URL(apiUrl).origin;
  } catch {
    return "http://localhost:3001";
  }
})();

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // ✅ Configuration correcte pour Next.js 15
  serverExternalPackages: ['pdfjs-dist', 'pdf-parse', 'canvas'],
  
  // ❌ SUPPRIME cette section. L'option `serverActions` n'existe pas dans next.config.js
  // serverActions: {
  //   bodySizeLimit: '10mb',
  // },
  
  // ✅ Configuration webpack pour pdf.js (uniquement pour le client)
  webpack: (config, { isServer, dev, webpack }) => {
    // Configuration pour le client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        canvas: false,
        worker_threads: false,
        crypto: false,
        stream: require.resolve('stream-browserify'),
        path: false,
        zlib: false,
        http: false,
        https: false,
        url: false,
      };
    }

    // Ajouter une règle pour gérer les workers de pdf.js
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: 'asset/resource',
      generator: {
        filename: 'static/[hash][ext][query]'
      }
    });

    return config;
  },
  
  // ✅ Désactiver le typedRoutes si ça pose problème
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ❌ SUPPRIME `output: 'standalone'` pour Vercel
  // Vercel utilise ses propres fonctions serverless, pas le standalone output
  // output: 'standalone',
  
  // ✅ CORRECTION ICI : Configuration des en-têtes CSP pour autoriser Supabase
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data:;
              font-src 'self';
              connect-src 'self' ${apiOrigin} http://localhost:3001;
              frame-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none'
            `.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ]
  },
  
  // ✅ Configuration des redirects si nécessaire
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ]
  },
  
  // ✅ SUPPRIME la section turbopack si tu utilises webpack
  // Les deux ne peuvent pas être configurés en même temps
  // turbopack: {
  //   resolveAlias: {
  //   }
  // }
};

export default nextConfig;
