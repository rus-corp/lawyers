"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { error } from "console";


type YookassaPageProps = {
  paymentToken: string;
  returnUrl: string;
};


const YookassaComponent = ({ paymentToken, returnUrl}: YookassaPageProps) => {
  useEffect(() => {
    if (!paymentToken || typeof window === "undefined") return;
    const script = document.createElement("script");
    script.src = 'https://yookassa.ru/checkout-widget/v1/checkout-widget.js';
    script.async = true;

    script.onload = () => {
      const checkout = new (window as any).YooMoneyCheckoutWidget({
        confirmation_token: paymentToken,
        return_url: returnUrl,
        error_callback: (error: any) => {
          console.error("Yookassa error:", error);
          // Optionally, you can redirect to an error page or show a message
        }
      });
      checkout.render('payment-form').then(() => {
        console.log("Yookassa widget rendered successfully");
      });
      return () => {
        checkout.destroy();
      };
    };
    document.body.appendChild(script);
  }, [paymentToken, returnUrl]);
  return <div id="payment-form" style={{ width: '100%', height: '100%' }} />;
}

export default YookassaComponent;