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
        nextConfig.basePath = '/jsonSaver'
    }
    return nextConfig
}

export default config
