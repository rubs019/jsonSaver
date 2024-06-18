import { PHASE_PRODUCTION_BUILD } from 'next/constants.js'

// @ts-check
const config = (phase, _) => {
    /**
     * @type {import('next').NextConfig}
     */
    const nextConfig = {
        output: "export",
        distDir: 'dist',
    }
    if (phase === PHASE_PRODUCTION_BUILD) {
        nextConfig.basePath = '/jsonSaver'
    }

    console.log('nextConfig', nextConfig)
    return nextConfig
}

export default config
