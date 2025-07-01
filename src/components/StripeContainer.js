import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import PaymentForm from "../components/payment/PaymentForm"

const PUBLIC_KEY = "pk_live_51RfKf3AGJ9VOvdss54yJ571gHjYqx6PD2E7TyQCfwsBWcY7JFaRlif9cddDMFg6kubKygzWkWxFKPUwCqHWYEieB00TfkqnrUX"

const stripeTestPromise = loadStripe(PUBLIC_KEY)

export default function StripeContainer() {
	return (
		<Elements stripe={stripeTestPromise}>
			<PaymentForm />
		</Elements>
	)
}
