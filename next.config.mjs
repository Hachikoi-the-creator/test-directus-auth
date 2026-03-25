/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "backend.crm.dorstep.mx",
          pathname: "/**",
        },
        // https://dstp.to/byd-song-pro-dmi-blue-exterior-lifestyle-shot.jpg
        {
          protocol: "https",
          hostname: "dstp.to",
          pathname: "/**",
        },
      ],
    },
  };

  export default nextConfig;
