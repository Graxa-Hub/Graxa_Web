import { Camera } from "lucide-react";

export const ConfigPhoto = ({ onChange, src }) => {
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border bg-gray-100">
                {src ? (
                    <img
                        src={src}
                        className="w-full h-full object-cover"
                        alt="Foto do usuário"
                    />
                ) : (
                    <Camera size={36} className="text-gray-400 m-auto" />
                )}
            </div>

            <label className="cursor-pointer px-4 py-2 bg-gray-800 text-white rounded-full flex items-center gap-2">
                <Camera size={18} />
                <span>Alterar foto</span>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onChange}
                />
            </label>
        </div>
    );
};