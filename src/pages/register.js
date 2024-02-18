import React, { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import Axios from "@/lib/axios"
import Btn from "@/components/core/Btn"

const register = (props) => {
	const router = useRouter()

	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [passwordConfirmation, setPasswordConfirmation] = useState("")
	const [loading, setLoading] = useState()

	const onSubmit = (e) => {
		setLoading(true)

		e.preventDefault()

		Axios.get("/sanctum/csrf-cookie").then(() => {
			Axios.post(`/register`, {
				name: name,
				email: email,
				password: password,
				password_confirmation: passwordConfirmation,
				device_name: "deviceName",
				remember: "checked",
			})
				.then((res) => {
					props.setMessages([res.data.message])
					// Remove loader
					setLoading(false)
					// Encrypt and Save Sanctum Token to Local Storage
					props.setLocalStorage("sanctumToken", res.data.data)
					// Update Logged in user
					props.get(`auth`, props.setAuth, "auth", false)
					// Redirect to Home
					setTimeout(() => router.push("/"), 500)
				})
				.catch((err) => {
					// Remove loader
					setLoading(false)
					props.getErrors(err)
				})

			// setPhone("07")
		})
	}

	return (
		<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<img
					className="mx-auto h-10 w-auto"
					src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
					alt="Your Company"
				/>
				<Link href="/">
					<a className="text-sm font-semibold leading-6 text-gray-900">
						<span aria-hidden="true">&larr;</span> Back
					</a>
				</Link>
				<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
					Sign up for an account
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form method="POST" action="" className="space-y-6" onSubmit={onSubmit}>
					{/* Name */}
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium leading-6 text-gray-900">
							Name
						</label>
						<div className="mt-2">
							<input
								id="name"
								name="name"
								type="name"
								autoComplete="name"
								required
								className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
					</div>
					{/* Name End */}

					{/* Email */}
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium leading-6 text-gray-900">
							Email address
						</label>
						<div className="mt-2">
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
					</div>
					{/* Email End */}

					{/* Password */}
					<div>
						<div className="flex items-center justify-between">
							<label
								htmlFor="password"
								className="block text-sm font-medium leading-6 text-gray-900">
								Password
							</label>
						</div>
						<div className="mt-2">
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>
					{/* Password End */}

					{/* Password Confirmation */}
					<div>
						<div className="flex items-center justify-between">
							<label
								htmlFor="password"
								className="block text-sm font-medium leading-6 text-gray-900">
								Confirm Password
							</label>
							<div className="text-sm">
								<a
									href="#"
									className="font-semibold text-indigo-600 hover:text-indigo-500">
									Forgot password?
								</a>
							</div>
						</div>
						<div className="mt-2">
							<input
								id="password-confirmation"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								onChange={(e) => setPasswordConfirmation(e.target.value)}
							/>
						</div>
					</div>
					{/* Password Confirmation End */}

					{/* Button */}
					<div>
						<Btn type="submit" btnText="Sign in" loading={loading} />
					</div>
					{/* Button End */}
				</form>

				<p className="mt-10 text-center text-sm text-gray-500">
					Already a member?{" "}
					<Link href="/login">
						<a className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
							Sign in
						</a>
					</Link>
				</p>
			</div>
		</div>
	)
}

export default register
