import React, { useRef, useEffect } from 'react';
import { Coins, CheckCircle2, X, Loader2 } from 'lucide-react';

interface ScratchCardOverlayProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    calculatedCoins: number;
    isScratched: boolean;
    setIsScratched: React.Dispatch<React.SetStateAction<boolean>>;
    isProcessing: boolean;
    processTransaction: () => Promise<void>;
    onCancel: () => void;
}

export default function ScratchCardOverlay({
    canvasRef, calculatedCoins, isScratched, setIsScratched,
    isProcessing, processTransaction, onCancel
}: ScratchCardOverlayProps) {
    
    const [isScratching, setIsScratching] = React.useState<boolean>(false);
    const isZeroCoins = calculatedCoins === 0;

    // --- CANVAS LOGIC ---

    const initCanvas = (): void => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = 300;
        canvas.height = 200;
        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#A9A9A9";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#555";
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("SCRATCH HERE", 150, 100);
    };

    const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): void => {
        const canvas = canvasRef.current;
        if (!canvas || isScratched) return;
        const rect: DOMRect = canvas.getBoundingClientRect();

        let clientX: number;
        let clientY: number;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x: number = clientX - rect.left;
        const y: number = clientY - rect.top;

        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (!ctx) return;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
    };

    const checkReveal = (): void => {
        setIsScratching(false);
        const canvas = canvasRef.current;
        if (!canvas || isScratched) return;
        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

        if (!ctx) return;
        const imageData: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let transparent: number = 0;

        for (let i = 3; i < imageData.data.length; i += 4) {
            if (imageData.data[i] === 0) transparent++;
        }

        // 40% revealed threshold
        if (transparent / (imageData.data.length / 4) > 0.4) {
            setIsScratched(true);
            processTransaction(); // Trigger API call and confetti via parent prop
        }
    };

    useEffect(() => {
        // Initialize canvas when the overlay mounts
        if (!isScratched) {
            // Use setTimeout to ensure canvas ref is available after render
            setTimeout(initCanvas, 100); 
        }
    }, [isScratched]);

    // --- RENDER CONTENT ---
    let prizeContent;

    if (isScratched && !isProcessing) {
        // State 3: Success/Navigation Pending
        const icon = isZeroCoins ? <X className="w-10 h-10 mb-3 text-red-300 drop-shadow-lg" /> : <CheckCircle2 className="w-10 h-10 mb-3 text-white drop-shadow-lg" />;
        const message = isZeroCoins ? "Next time shop for ₹10 or more to start earning! Redirecting..." : "Thank you for shopping! Redirecting now...";
        const title = isZeroCoins ? "SORRY!" : "Transaction Complete!";

        prizeContent = (
            <div className="flex flex-col items-center text-white p-4 animate-in fade-in duration-500">
                <div className="text-center">
                    {icon}
                    <span className={`text-xl font-bold uppercase tracking-wide ${isZeroCoins ? 'text-red-100' : 'text-white'}`}>
                        {title}
                    </span>
                    <div className="text-6xl font-black mt-2 drop-shadow-lg">
                        {calculatedCoins}
                    </div>
                    <div className="font-bold text-2xl mt-1">COINS EARNED</div>
                    <p className={`mt-4 text-sm font-semibold ${isZeroCoins ? 'text-red-200' : 'text-indigo-100'}`}>
                        {message}
                    </p>
                </div>
            </div>
        );
    } else if (isProcessing) {
        // State 2: Processing API
        prizeContent = (
            <div className="flex flex-col items-center text-white p-4">
                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                <span className="font-bold text-lg">Crediting Coins...</span>
            </div>
        );
    } else {
        // State 1: Before Scratch / Hidden Prize
        prizeContent = (
            <div className="flex flex-col items-center text-white p-4">
                <Coins className="w-14 h-14 text-white drop-shadow-md mb-2" />
                <div className="text-5xl font-black drop-shadow-md">{calculatedCoins}</div>
                <div className="text-white font-bold text-lg mt-1">COINS</div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center relative overflow-hidden shadow-2xl">

                {/* Cancel Button */}
                <button
                    onClick={onCancel}
                    disabled={isScratched}
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {isScratched ? (isZeroCoins ? "Better Luck Next Time!" : "Congratulations!") : "Scratch To Claim!"}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    {isScratched ? "Your purchase is recorded." : "Reveal your reward below."}
                </p>

                <div className="relative w-full max-w-[300px] h-[200px] mx-auto rounded-xl overflow-hidden shadow-2xl ring-4 ring-indigo-500/50">

                    {/* The Prize (Behind Canvas) */}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center 
                        ${isScratched && isZeroCoins
                            ? 'bg-gradient-to-br from-red-500 to-red-700'
                            : 'bg-gradient-to-br from-yellow-300 to-orange-500'
                        }`}
                    >
                        {prizeContent}
                    </div>

                    {/* The Scratch Layer */}
                    {!isScratched && (
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                            onMouseDown={(e) => { setIsScratching(true); scratch(e); }}
                            onMouseMove={(e) => isScratching && scratch(e)}
                            onMouseUp={checkReveal}
                            onMouseLeave={checkReveal}
                            onTouchStart={(e) => { setIsScratching(true); scratch(e); }}
                            onTouchMove={(e) => isScratching && scratch(e)}
                            onTouchEnd={checkReveal}
                        />
                    )}
                </div>

            </div>
        </div>
    );
}