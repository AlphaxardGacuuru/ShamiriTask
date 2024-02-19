const nextConfig = {
	output: "export",
	images: {
		domains: ["rickandmortyapi.com"],
	},
	experimental: {
		concurrentFeatures: true,
	},
}

module.exports = nextConfig
