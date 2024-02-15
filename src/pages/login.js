import React from "react"

const login = () => {
	return (
		<div className="block mt-4">
			<label htmlFor="remember_me" className="inline-flex items-center">
				<input
					id="remember_me"
					type="checkbox"
					name="remember"
					className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					onChange={(event) => setShouldRemember(event.target.checked)}
				/>

				<span className="ml-2 text-sm text-gray-600">Remember me</span>
			</label>
		</div>
	)
}

export default login
