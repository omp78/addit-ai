import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shake, setShake] = useState(false);

    const navigate = useNavigate();

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const handleGoogleCallback = async (response) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post("/auth/google", {
                credential: response.credential
            });
            localStorage.setItem("token", res.data.access_token);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError("Google login failed. Please try again.");
            triggerShake();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initGoogle = () => {
            if (window.google) {
                const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID || "733475149303-placeholderclientid.apps.googleusercontent.com";
                window.google.accounts.id.initialize({
                    client_id: client_id,
                    callback: handleGoogleCallback,
                });
                window.google.accounts.id.renderButton(
                    document.getElementById("google-signin-btn"),
                    {
                        theme: "outline",
                        size: "large",
                        width: "360",
                        text: "signup_with",
                        shape: "square",
                    }
                );
            } else {
                setTimeout(initGoogle, 300);
            }
        };

        initGoogle();
    }, []);


    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            triggerShake();
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/register", { name, email, password });
            alert("Account created successfully");
            navigate("/login");
        }
        catch (err) {
            console.log(err);
            setError("Registration failed. Try a different email.");
            triggerShake();
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <motion.div
                initial={{ scale: 0.7, rotate: 0, opacity: 0 }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    rotate: shake ? 0 : 0,
                    x: shake ? [0, -10, 10, -10, 10, 0] : 0,
                }}
                whileHover={{ rotate: 0.2 }}
                transition={{ type: "spring", stiffness: 160, damping: 14 }}
                className="

                bg-[#fffaf0]

                border-4
                border-black

                rounded-2xl

                p-8
                sm:p-10

                shadow-[10px_10px_0_black]

                w-full
                mx-auto
                max-w-md

                relative

                before:absolute

                before:-top-5
                before:left-1/2

                before:-translate-x-1/2

                before:w-24
                before:h-8

                before:bg-yellow-200

                before:border-2
                before:border-black

                "
            >
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-black mb-1"
                >
                    ⚡ Addit AI
                </motion.h1>
                <p className="font-bold mb-8 text-black/70">Join the splice bench 🎞️</p>

                <form onSubmit={handleRegister}>
                    <label className="font-black block mb-2">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="block border-4 border-black p-3 w-full bg-[#FFF7ED] font-bold mb-5
                                   focus:outline-none focus:bg-[#FFD23F] transition-colors"
                        placeholder="Om"
                    />

                    <label className="font-black block mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="block border-4 border-black p-3 w-full bg-[#FFF7ED] font-bold mb-5
                                   focus:outline-none focus:bg-[#FFD23F] transition-colors"
                        placeholder="you@example.com"
                    />

                    <label className="font-black block mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block border-4 border-black p-3 w-full bg-[#FFF7ED] font-bold mb-5
                                   focus:outline-none focus:bg-[#FFD23F] transition-colors"
                        placeholder="••••••••"
                    />

                    <label className="font-black block mb-2">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="block border-4 border-black p-3 w-full bg-[#FFF7ED] font-bold mb-2
                                   focus:outline-none focus:bg-[#FFD23F] transition-colors"
                        placeholder="••••••••"
                    />

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-600 font-black mt-3 mb-1 text-sm"
                        >
                            ⚠️ {error}
                        </motion.p>
                    )}

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileTap={{ x: 4, y: 4 }}
                        className="mt-6 w-full bg-[#3A86FF] text-white border-4 border-black py-3 font-black text-lg
                                   shadow-[6px_6px_0_black] hover:translate-x-1 hover:translate-y-1
                                   hover:shadow-none transition-all disabled:opacity-60"
                    >
                        {loading ? (
                            <motion.span
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                Creating account...
                            </motion.span>
                        ) : (
                            "Create Account ✨"
                        )}
                    </motion.button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t-4 border-black"></div>
                    <span className="px-3 font-black text-sm bg-[#fffaf0]">OR</span>
                    <div className="flex-1 border-t-4 border-black"></div>
                </div>

                <div
                    className="border-4 border-black rounded-lg overflow-hidden bg-white shadow-[4px_4px_0_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex justify-center py-1"
                >
                    <div id="google-signin-btn"></div>
                </div>

                <p className="mt-6 font-bold text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="underline decoration-4 decoration-[#FF6B35]">
                        Login
                    </Link>
                </p>
            </motion.div>
        </AuthLayout>
    );
}

export default Register;
