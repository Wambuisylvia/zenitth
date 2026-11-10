import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MpesaModal = ({ isOpen, onClose }) => {

    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    const amount = 300;

    const handleSubmit = async (e) => {

        e.preventDefault();

        const loadingToast = toast.loading("Please wait...");
        try {

            // setLoading(true);

            const formData = new FormData();

            formData.append("amount", amount);
            formData.append("phone", phone);

            const response = await axios.post(
                "https://sylviawambuu.alwaysdata.net/api/mpesa_payment", formData
            );

            console.log(response.data);

            if (response.status === 200) {
                toast.update(loadingToast, {
                                    render: response.data.success,
                                    type: "success",
                                    isLoading: false,
                                    autoClose: 3000,
                                    closeButton: false
                                });
            }

            setPhone("");

            setTimeout(()=>{
                onClose()
            }, 3000)

        } catch (error) {

            console.error(error);

            // alert("Payment request failed.");

        } finally {

            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="mpesa-modal-overlay">

            <div className="mpesa-modal">

                <button
                    className="mpesa-close"
                    onClick={onClose}
                >
                    ✕
                </button>

                <img
                    src="mpesa.webp"
                    alt="Mpesa Logo"
                    className="mpesa-logo"
                />

                <h2>Lipa na Mpesa</h2>

                <p className="mpesa-subtitle">
                    Enter your phone number to continue
                </p>

                <form
                    className="mpesa-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        type="tel"
                        placeholder="e.g. 254712345678"
                        value={phone}
                        onChange={(e) =>
                            setPhone(e.target.value)
                        }
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : `Pay KES ${amount}`}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default MpesaModal;