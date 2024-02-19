import Document, { Html, Head, Main, NextScript } from "next/document"
import Script from "next/script"

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		return { ...initialProps }
	}

	render() {
		return (
			<Html>
				<Head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					{/* {{-- Change address bar color Chrome, Firefox OS and Opera --}} */}
					<meta name="theme-color" content="#232323" />
					{/* {{-- iOS Safari --}} */}
					<meta
						name="apple-mobile-web-app-status-bar-style"
						content="#232323"
					/>
					<meta
						name="description"
						content="The best Kenyan Online Music Store"
					/>

					{/* <!-- CSRF Token --> */}
					<meta name="csrf-token" content="{{ csrf_token() }}" />

					<title>Shamiri Task</title>

					{/* <!-- Favicon  --> */}
					<link rel="icon" href="/storage/img/musical-note.png" />

					{/* <!-- Fonts --> */}
					<link rel="dns-prefetch" href="//fonts.gstatic.com" />
					<link
						href="https://fonts.googleapis.com/css?family=Nunito"
						rel="stylesheet"
					/>
					<link
						href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700"
						rel="stylesheet"
					/>

					{/* Tailwind */}
					{/* <script src="https://cdn.tailwindcss.com"></script> */}
				</Head>
				<body className="antialiased h-full bg-white">
					<noscript>
						<center>
							<h2 className="m-5">
								We're sorry but Black Music doesn't work properly without
								JavaScript enabled. Please enable it to continue.
							</h2>
						</center>
					</noscript>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
