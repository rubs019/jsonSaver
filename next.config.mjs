import { PHASE_PRODUCTION_BUILD } from 'next/constants.js'

// @ts-check
const config = (phase, _) => {
    /**
     * @type {import('next').NextConfig}
     */
    const nextConfig = {
        output: "export",
        distDir: 'dist',
        images: { unoptimized: true },
    }
    if (phase === PHASE_PRODUCTION_BUILD) {
        nextConfig.basePath = '/json'
        nextConfig.assetPrefix = '/json'
    } else {
        console.log('Current phase', phase)
    }
    return nextConfig
}

export default config
