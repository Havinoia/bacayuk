"use client";

import { useState, useCallback, useRef } from "react";
import { X, User, Image as ImageIcon, Loader2, Camera, Check, RotateCcw } from "lucide-react";
import { updateProfile } from "@/app/actions/profile";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/image-utils";

import { useRouter } from "next/navigation";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        id: string;
        name: string;
        image: string | null;
    };
}

export function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
    const router = useRouter();
    const [name, setName] = useState(user.name);
    const [image, setImage] = useState(user.image || "");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cropping states
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isCropping, setIsCropping] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setSelectedFile(reader.result?.toString() || null);
                setIsCropping(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmCrop = async () => {
        if (!selectedFile || !croppedAreaPixels) return;

        try {
            setIsLoading(true);
            const croppedImage = await getCroppedImg(selectedFile, croppedAreaPixels);
            setImage(croppedImage);
            setIsCropping(false);
            setSelectedFile(null);
        } catch (e) {
            console.error(e);
            setError("Gagal memproses gambar");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelCrop = () => {
        setIsCropping(false);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await updateProfile(user.id, {
                name,
                image: image || "",
            });

            if (result.success) {
                router.refresh();
                onClose();
            } else {
                setError(result.error || "Gagal memperbarui profil");
            }
        } catch (err) {
            setError("Terjadi kesalahan sistem");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div 
                className="absolute inset-0 bg-[var(--base-color-plum-black)]/40 backdrop-blur-md"
                onClick={onClose}
            />
            
            <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-pin-enter flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-[var(--base-color-plum-black)]">
                        {isCropping ? "Sesuaikan Foto" : "Edit Profil Anda"}
                    </h3>
                    <button 
                        onClick={isCropping ? handleCancelCrop : onClose}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-8 space-y-8 overflow-y-auto">
                    {error && (
                        <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 italic">
                            {error}
                        </div>
                    )}

                    {!isCropping ? (
                        <div className="space-y-8">
                            {/* Profile Image Preview & Upload */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100">
                                        {image ? (
                                            <img src={image} alt="Profile Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <User size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 p-2.5 bg-[var(--base-color-pinterest-red)] text-white rounded-full shadow-lg hover:scale-110 transition-all active:scale-95"
                                    >
                                        <Camera size={18} />
                                    </button>
                                    <input 
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Klik ikon kamera untuk ganti foto</p>
                            </div>

                            <div className="space-y-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <label className="text-[12px] font-black text-[var(--base-color-olive-gray)] uppercase tracking-widest flex items-center gap-2">
                                        <User size={14} /> Nama Petualang
                                    </label>
                                    <input 
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[var(--base-color-pinterest-red)] focus:bg-white outline-none transition-all font-bold text-lg text-[var(--base-color-plum-black)]"
                                        placeholder="Masukkan nama..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Cropping UI */
                        <div className="space-y-6">
                            <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden bg-slate-900">
                                <Cropper
                                    image={selectedFile || ""}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-[var(--base-color-olive-gray)] uppercase tracking-widest">Zoom</label>
                                        <span className="text-[10px] font-black text-slate-400">{(zoom * 100).toFixed(0)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[var(--base-color-pinterest-red)]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
                    {!isCropping ? (
                        <>
                            <button 
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 font-black rounded-2xl text-[var(--base-color-olive-gray)] hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex-[2] btn-pin-primary py-4 text-white font-black rounded-2xl shadow-xl disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                                style={{ color: 'white' }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    "Simpan Perubahan"
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                type="button"
                                onClick={handleCancelCrop}
                                className="flex-1 py-4 font-black rounded-2xl text-[var(--base-color-olive-gray)] hover:bg-slate-200 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={14} /> Batal
                            </button>
                            <button 
                                onClick={handleConfirmCrop}
                                disabled={isLoading}
                                className="flex-[2] btn-pin-primary py-4 text-white font-black rounded-2xl shadow-xl disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                                style={{ color: 'white' }}
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <Check size={18} />
                                )}
                                <span>Potong & Gunakan</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
