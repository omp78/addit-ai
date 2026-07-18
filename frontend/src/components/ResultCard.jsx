
import { useState } from "react";
import api from "../api/axios";
import { motion } from "motion/react";

function PaperCard({
    children,
    delay=0
}){


return(

<motion.div

initial={{

    opacity:0,

    y:-30,

    rotate:0

}}

animate={{

    opacity:1,

    y:0,

    rotate:0

}}

transition={{

    delay:delay,

    type:"spring",

    stiffness:130

}}


className="

bg-white

border-4
border-black

rounded-xl

p-6

shadow-[8px_8px_0_black]

"

>


{children}


</motion.div>

)

}
function ResultCard({result}){
    const [activeTab, setActiveTab] = useState("summary");
    const [copiedState, setCopiedState] = useState({});
    const [clipLayouts, setClipLayouts] = useState({});
    const [exportingClips, setExportingClips] = useState({});

    if(!result){
        return null;
    }

    const tabs = [
        { id: "summary", label: "📝 Summary & Moments", color: "#FFD23F" },
        { id: "youtube", label: "🎬 YouTube Optimizer", color: "#3A86FF" },
        { id: "creator", label: "🔥 Creator Insights", color: "#FF6B35" },
        { id: "social", label: "📱 Social Posts", color: "#EC4899" },
        { id: "clips", label: "✂️ AI Clips", color: "#F77F00" }
    ];

    const copyToClipboard = (key, text) => {
        navigator.clipboard.writeText(text);
        setCopiedState(prev => ({ ...prev, [key]: true }));
        setTimeout(() => {
            setCopiedState(prev => ({ ...prev, [key]: false }));
        }, 2000);
    };

    const handleExportClip = async (clip, idx) => {
        const layout = clipLayouts[idx] || "vertical";
        setExportingClips(prev => ({ ...prev, [idx]: true }));
        try {
            const response = await api.post(
                `/jobs/${result.job_id}/trim`,
                {
                    start_time: clip.start_time,
                    end_time: clip.end_time,
                    aspect_ratio: layout
                },
                {
                    responseType: "blob"
                }
            );

            const blob = new Blob([response.data], { type: "video/mp4" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${clip.title.replace(/[^a-zA-Z0-9]/g, "_")}_${layout}.mp4`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Export clip failed:", error);
            alert("Export clip failed. Make sure the original video is still available on the server.");
        } finally {
            setExportingClips(prev => ({ ...prev, [idx]: false }));
        }
    };

    const creatorIntel = result.creator_intelligence;
    const socialPkg = result.social_package;
    const shortsPkg = result.shorts_package;

    return(
        <div className="mt-8 space-y-6">
            <motion.h1
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-black my-8"
            >
                ✨ AI Magic Created
            </motion.h1>

            {/* Tab navigation */}
            <div className="flex flex-wrap gap-3 mb-8">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`border-4 border-black px-6 py-2.5 font-black text-sm md:text-base shadow-[4px_4px_0_black] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:translate-y-0.5 transition-all cursor-pointer ${
                            activeTab === t.id
                                ? `translate-x-0.5 translate-y-0.5 shadow-none`
                                : "bg-white"
                        }`}
                        style={{
                            backgroundColor: activeTab === t.id ? t.color : "#fff",
                            color: activeTab === t.id && (t.color === "#3A86FF" || t.color === "#EC4899" || t.color === "#F77F00") ? "#fff" : "#000"
                        }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {activeTab === "summary" && (
                <div className="space-y-6">
                    <PaperCard delay={0}>
                        <h2 className="text-xl font-bold mb-3">✨ Summary</h2>
                        <p className="text-black/70 font-semibold leading-relaxed">{result.summary}</p>
                    </PaperCard>

                    <PaperCard delay={0.1}>
                        <h2 className="text-xl font-bold mb-4">⏱️ Important Moments</h2>
                        <div className="space-y-3">
                            {result.chapters?.map((chapter, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-[#FFD23F] border-4 border-black p-4 flex items-center gap-5 shadow-[5px_5px_0_black] font-black"
                                >
                                    <span className="bg-black text-white px-3 py-1 text-sm">{chapter.time}</span>
                                    <p>{chapter.title}</p>
                                </motion.div>
                            ))}
                        </div>
                    </PaperCard>

                    <PaperCard delay={0.15}>
                        <h2 className="text-xl font-bold mb-3">📌 Key Points</h2>
                        <ul className="list-disc ml-5 space-y-2 font-semibold text-black/70">
                            {result.key_points?.map((point, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    {point}
                                </motion.li>
                            ))}
                        </ul>
                    </PaperCard>
                </div>
            )}

            {activeTab === "youtube" && (
                <div className="space-y-6">
                    <PaperCard delay={0}>
                        <h2 className="text-xl font-bold mb-5">🎬 YouTube Optimizer Package</h2>
                        
                        <div className="space-y-5">
                            <div>
                                <h3 className="font-black text-sm uppercase text-[#3A86FF] mb-1">Recommended Title</h3>
                                <p className="text-black font-bold text-lg bg-[#FFF7ED] border-2 border-black p-3 shadow-[2px_2px_0_black]">{result.youtube_title}</p>
                            </div>

                            <div>
                                <h3 className="font-black text-sm uppercase text-[#3A86FF] mb-1">Description Draft</h3>
                                <pre className="text-black font-semibold whitespace-pre-wrap font-sans bg-[#FFF7ED] border-2 border-black p-4 shadow-[2px_2px_0_black] leading-relaxed">{result.youtube_description}</pre>
                            </div>

                            <div>
                                <h3 className="font-black text-sm uppercase text-[#3A86FF] mb-1">SEO Tag Keywords</h3>
                                <p className="text-black/80 font-bold bg-[#FFF7ED] border-2 border-black p-3 shadow-[2px_2px_0_black]">
                                    {result.seo_keywords?.join(", ")}
                                </p>
                            </div>
                        </div>
                    </PaperCard>
                </div>
            )}

            {activeTab === "creator" && (
                <div className="space-y-6">
                    {!creatorIntel ? (
                        <PaperCard>
                            <div className="text-center py-12">
                                <span className="text-5xl mb-4 block">🔮</span>
                                <h3 className="text-2xl font-black mb-2">No Creator Insights Available</h3>
                                <p className="text-black/60 font-bold max-w-md mx-auto">
                                    This video was processed using an older version of the pipeline. Try uploading a new video to unlock AI Viral scoring, Hook analysis, and thumbnail prompts!
                                </p>
                            </div>
                        </PaperCard>
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <PaperCard delay={0}>
                                    <h3 className="text-xl font-black mb-3">🔥 Viral Score</h3>
                                    <div className="flex flex-col items-center justify-center py-6">
                                        <div className="relative flex items-center justify-center w-36 h-36 border-8 border-black rounded-full bg-[#FF6B35] text-white shadow-[6px_6px_0_black]">
                                            <span className="text-4xl font-black">{creatorIntel.viral_score}%</span>
                                        </div>
                                        <p className="font-bold text-center mt-6 text-black/70">
                                            {creatorIntel.viral_score >= 80 
                                                ? "High viral potential! The pacing, topic relevance, and structured hooks are highly engaging."
                                                : creatorIntel.viral_score >= 60 
                                                ? "Moderate potential. Solid topic, but can perform better with punchier hooks or edits."
                                                : "Lower viral potential. Best suited for targeted interest groups."
                                            }
                                        </p>
                                    </div>
                                </PaperCard>

                                <PaperCard delay={0.05}>
                                    <h3 className="text-xl font-black mb-5">📱 Platform Suitability</h3>
                                    <div className="space-y-4">
                                        {Object.entries(creatorIntel.platform_scores || {}).map(([platform, score]) => (
                                            <div key={platform}>
                                                <div className="flex justify-between font-black text-sm mb-1 capitalize">
                                                    <span>{platform.replace("_", " ")}</span>
                                                    <span>{score}%</span>
                                                </div>
                                                <div className="border-4 border-black h-6 bg-white overflow-hidden rounded-md">
                                                    <div
                                                        style={{ width: `${score}%` }}
                                                        className={`h-full border-r-2 border-black transition-all ${
                                                            platform.includes("youtube") ? "bg-[#FF6B35]" : "bg-[#3A86FF]"
                                                        }`}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </PaperCard>
                            </div>

                            <PaperCard delay={0.1}>
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-black pb-4 mb-4">
                                    <h3 className="text-xl font-black">⚡ Hook Analysis</h3>
                                    <span className={`px-4 py-1 border-4 border-black font-black text-sm shadow-[2px_2px_0_black] ${
                                        creatorIntel.hook_analysis?.rating === "Strong" ? "bg-green-300" :
                                        creatorIntel.hook_analysis?.rating === "Medium" ? "bg-yellow-300" : "bg-red-300"
                                    }`}>
                                        Rating: {creatorIntel.hook_analysis?.rating || "N/A"}
                                    </span>
                                </div>
                                <p className="font-bold text-black/80 mb-4">{creatorIntel.hook_analysis?.feedback}</p>
                                <h4 className="font-black text-sm uppercase text-[#FF6B35] mb-2">Suggestions to Optimize:</h4>
                                <ul className="list-disc ml-5 space-y-2 font-bold text-black/75">
                                    {creatorIntel.hook_analysis?.suggestions?.map((s, idx) => (
                                        <li key={idx}>{s}</li>
                                    ))}
                                </ul>
                            </PaperCard>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <PaperCard delay={0.15}>
                                    <h3 className="text-xl font-black mb-3">🎯 Target Audience</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <span className="font-black text-[#3A86FF] text-sm uppercase block">Demographics:</span>
                                            <p className="font-bold text-black/85 mt-1">{creatorIntel.audience_detection?.demographics}</p>
                                        </div>
                                        <div>
                                            <span className="font-black text-[#3A86FF] text-sm uppercase block">Interests:</span>
                                            <p className="font-bold text-black/85 mt-1">{creatorIntel.audience_detection?.interests}</p>
                                        </div>
                                    </div>
                                </PaperCard>

                                <PaperCard delay={0.2}>
                                    <h3 className="text-xl font-black mb-3">📅 Best Time to Upload</h3>
                                    <ul className="space-y-3 mt-2">
                                        {creatorIntel.upload_time_suggestions?.map((t, idx) => (
                                            <li key={idx} className="flex items-center gap-3 bg-[#FFF7ED] border-2 border-black p-3 font-bold shadow-[2px_2px_0_black]">
                                                <span>⏰</span>
                                                <span className="text-black/85">{t}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </PaperCard>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <PaperCard delay={0.25}>
                                    <h3 className="text-xl font-black mb-4">📢 Optimal CTAs</h3>
                                    <ul className="space-y-3">
                                        {creatorIntel.cta_suggestions?.map((cta, idx) => (
                                            <li key={idx} className="flex items-start gap-3 bg-blue-50 border-2 border-black p-3.5 font-bold shadow-[3px_3px_0_black]">
                                                <span className="text-lg">💬</span>
                                                <span className="text-black/85 leading-relaxed">{cta}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </PaperCard>

                                <PaperCard delay={0.3}>
                                    <h3 className="text-xl font-black mb-4">🖼️ Visual Thumbnail Ideas</h3>
                                    <ul className="space-y-3">
                                        {creatorIntel.thumbnail_ideas?.map((idea, idx) => (
                                            <li key={idx} className="flex items-start gap-3 bg-yellow-50 border-2 border-black p-3.5 font-bold shadow-[3px_3px_0_black]">
                                                <span className="text-lg">💡</span>
                                                <span className="text-black/85 leading-relaxed">{idea}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </PaperCard>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "social" && (
                <div className="space-y-6 animate-fade-in">
                    {!socialPkg ? (
                        <PaperCard>
                            <div className="text-center py-12">
                                <span className="text-5xl mb-4 block">🔮</span>
                                <h3 className="text-2xl font-black mb-2">No Social Package Available</h3>
                                <p className="text-black/60 font-bold max-w-md mx-auto">
                                    This video was processed using an older version of the pipeline. Try uploading a new video to automatically generate captions and Twitter threads!
                                </p>
                            </div>
                        </PaperCard>
                    ) : (
                        <div className="space-y-6">
                            {/* Instagram Card */}
                            <PaperCard>
                                <div className="flex flex-wrap justify-between items-center gap-3 border-b-4 border-black pb-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">📸</span>
                                        <h3 className="text-xl font-black">Instagram Caption</h3>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard("instagram", `${socialPkg.instagram?.caption}\n\n${socialPkg.instagram?.hashtags?.join(" ")}`)}
                                        className="bg-[#EC4899] text-white border-2 border-black px-4 py-1.5 font-black text-sm shadow-[2px_2px_0_black] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:translate-y-0.5 transition-all cursor-pointer"
                                    >
                                        {copiedState["instagram"] ? "Copied! ✓" : "Copy Caption 📋"}
                                    </button>
                                </div>
                                <p className="font-semibold text-black/80 whitespace-pre-wrap leading-relaxed">{socialPkg.instagram?.caption}</p>
                                <div className="mt-4 pt-3 border-t-2 border-dashed border-black/20 text-[#EC4899] font-black text-sm">
                                    {socialPkg.instagram?.hashtags?.join(" ")}
                                </div>
                            </PaperCard>

                            {/* LinkedIn Card */}
                            <PaperCard>
                                <div className="flex flex-wrap justify-between items-center gap-3 border-b-4 border-black pb-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">💼</span>
                                        <h3 className="text-xl font-black">LinkedIn Post</h3>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard("linkedin", socialPkg.linkedin?.post)}
                                        className="bg-[#0077B5] text-white border-2 border-black px-4 py-1.5 font-black text-sm shadow-[2px_2px_0_black] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:translate-y-0.5 transition-all cursor-pointer"
                                    >
                                        {copiedState["linkedin"] ? "Copied! ✓" : "Copy Post 📋"}
                                    </button>
                                </div>
                                <pre className="font-semibold text-black/80 whitespace-pre-wrap leading-relaxed font-sans">{socialPkg.linkedin?.post}</pre>
                            </PaperCard>

                            {/* Twitter Thread Card */}
                            <PaperCard>
                                <div className="flex flex-wrap justify-between items-center gap-3 border-b-4 border-black pb-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">🐦</span>
                                        <h3 className="text-xl font-black">Twitter / X Thread</h3>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard("twitter", socialPkg.twitter?.thread?.join("\n\n---\n\n"))}
                                        className="bg-black text-white border-2 border-black px-4 py-1.5 font-black text-sm shadow-[2px_2px_0_black] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:translate-y-0.5 transition-all cursor-pointer"
                                    >
                                        {copiedState["twitter"] ? "Copied! ✓" : "Copy Entire Thread 📋"}
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {socialPkg.twitter?.thread?.map((tweet, idx) => (
                                        <div key={idx} className="bg-[#FFF7ED] border-2 border-black p-4 shadow-[3px_3px_0_black] relative">
                                            <span className="absolute top-2 right-3 text-xs bg-black text-white px-2 py-0.5 font-bold rounded">
                                                {idx + 1} / {socialPkg.twitter?.thread?.length}
                                            </span>
                                            <p className="font-semibold text-black/85 leading-relaxed pr-10">{tweet}</p>
                                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-black/10">
                                                <span className="text-xs font-bold text-black/40">{tweet.length} / 280 chars</span>
                                                <button
                                                    onClick={() => copyToClipboard(`tweet-${idx}`, tweet)}
                                                    className="bg-white border-2 border-black px-2.5 py-0.5 font-black text-xs shadow-[1.5px_1.5px_0_black] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                                                >
                                                    {copiedState[`tweet-${idx}`] ? "Copied! ✓" : "Copy Tweet 📋"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </PaperCard>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Facebook Card */}
                                <PaperCard>
                                    <div className="flex flex-wrap justify-between items-center gap-3 border-b-4 border-black pb-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">👥</span>
                                            <h3 className="text-xl font-black">Facebook Post</h3>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard("facebook", socialPkg.facebook?.caption)}
                                            className="bg-[#1877F2] text-white border-2 border-black px-3 py-1 font-black text-xs shadow-[2px_2px_0_black] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:translate-y-0.5 transition-all cursor-pointer"
                                        >
                                            {copiedState["facebook"] ? "Copied! ✓" : "Copy 📋"}
                                        </button>
                                    </div>
                                    <p className="font-semibold text-black/80 whitespace-pre-wrap leading-relaxed">{socialPkg.facebook?.caption}</p>
                                </PaperCard>

                                {/* Threads Card */}
                                <PaperCard>
                                    <div className="flex flex-wrap justify-between items-center gap-3 border-b-4 border-black pb-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">🧵</span>
                                            <h3 className="text-xl font-black">Threads Post</h3>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard("threads", socialPkg.threads?.post)}
                                            className="bg-black text-white border-2 border-black px-3 py-1 font-black text-xs shadow-[2px_2px_0_black] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:translate-y-0.5 transition-all cursor-pointer"
                                        >
                                            {copiedState["threads"] ? "Copied! ✓" : "Copy 📋"}
                                        </button>
                                    </div>
                                    <p className="font-semibold text-black/80 whitespace-pre-wrap leading-relaxed">{socialPkg.threads?.post}</p>
                                </PaperCard>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "clips" && (
                <div className="space-y-6 animate-fade-in">
                    {!shortsPkg ? (
                        <PaperCard>
                            <div className="text-center py-12">
                                <span className="text-5xl mb-4 block">🔮</span>
                                <h3 className="text-2xl font-black mb-2">No AI Clips Available</h3>
                                <p className="text-black/60 font-bold max-w-md mx-auto">
                                    This video was processed using an older version of the pipeline. Try uploading a new video to automatically generate ready-to-export vertical shorts!
                                </p>
                            </div>
                        </PaperCard>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {shortsPkg.map((clip, idx) => {
                                const isExporting = exportingClips[idx] || false;
                                const currentLayout = clipLayouts[idx] || "vertical";
                                return (
                                    <PaperCard key={idx} delay={idx * 0.1}>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-black pb-4 mb-4">
                                            <div>
                                                <h3 className="text-2xl font-black mb-1">🎬 {clip.title}</h3>
                                                <span className="inline-block bg-[#F77F00] text-white text-xs font-black px-3 py-1 border-2 border-black shadow-[1.5px_1.5px_0_black]">
                                                    ⏱️ {clip.start_time} - {clip.end_time}
                                                </span>
                                            </div>

                                            {/* Selector & Export Control */}
                                            <div className="flex flex-wrap items-center gap-3">
                                                <div className="flex border-2 border-black shadow-[2px_2px_0_black] bg-white rounded overflow-hidden">
                                                    <button
                                                        onClick={() => setClipLayouts(prev => ({ ...prev, [idx]: "vertical" }))}
                                                        className={`px-3 py-1.5 font-bold text-xs cursor-pointer transition-all ${
                                                            currentLayout === "vertical" 
                                                                ? "bg-black text-white" 
                                                                : "bg-white text-black hover:bg-black/5"
                                                        }`}
                                                    >
                                                        📱 Vertical (9:16)
                                                    </button>
                                                    <button
                                                        onClick={() => setClipLayouts(prev => ({ ...prev, [idx]: "original" }))}
                                                        className={`px-3 py-1.5 font-bold text-xs cursor-pointer border-l-2 border-black transition-all ${
                                                            currentLayout === "original" 
                                                                ? "bg-black text-white" 
                                                                : "bg-white text-black hover:bg-black/5"
                                                        }`}
                                                    >
                                                        🎬 Original Layout
                                                    </button>
                                                </div>

                                                <button
                                                    disabled={isExporting}
                                                    onClick={() => handleExportClip(clip, idx)}
                                                    className="bg-[#F77F00] text-white border-2 border-black px-4 py-2 font-black text-sm shadow-[3px_3px_0_black] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                >
                                                    {isExporting ? "Processing Clip... ⚙️" : "Export & Download 🚀"}
                                                </button>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-black/70 leading-relaxed">
                                            {clip.description}
                                        </p>
                                    </PaperCard>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


export default ResultCard;