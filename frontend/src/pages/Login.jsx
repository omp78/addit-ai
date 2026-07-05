import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shake, setShake] = useState(false);

    const navigate = useNavigate();

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", response.data.access_token);
            navigate("/dashboard");
        }
        catch (err) {
            console.log(err);
            setError("Login failed. Check your email and password.");
            triggerShake();
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <motion.div
                initial={{ scale: 0.7, rotate: -4, opacity: 0 }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    rotate: shake ? 0 : 0,
                    x: shake ? [0, -10, 10, -10, 10, 0] : 0,
                }}
                whileHover={{ rotate: -0.5 }}
                transition={{ type: "spring", stiffness: 160, damping: 14 }}
                className="

                bg-[#fffaf0]

                border-4
                border-black

                rounded-2xl
                mx-auto
                p-8
                sm:p-10

                shadow-[10px_10px_0_black]

                w-full

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
                <p className="font-bold mb-8 text-black/70">Welcome back, splice it up 🎬</p>

                <form onSubmit={handleLogin}>
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
                        className="mt-6 w-full bg-[#FF6B35] border-4 border-black py-3 font-black text-lg
                                   shadow-[6px_6px_0_black] hover:translate-x-1 hover:translate-y-1
                                   hover:shadow-none transition-all disabled:opacity-60"
                    >
                        {loading ? (
                            <motion.span
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                Logging in...
                            </motion.span>
                        ) : (
                            "Login 🚀"
                        )}
                    </motion.button>
                </form>

                <p className="mt-6 font-bold text-center">
                    New here?{" "}
                    <Link to="/register" className="underline decoration-4 decoration-[#3A86FF]">
                        Create account
                    </Link>
                </p>
            </motion.div>
        </AuthLayout>
    );
}

export default Login;
