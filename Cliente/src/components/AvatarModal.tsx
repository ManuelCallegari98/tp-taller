import React from 'react';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';

const seeds = [
    'avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5',
    'avatar-6', 'avatar-7', 'avatar-8', 'avatar-9', 'avatar-10',
    'avatar-11', 'avatar-12', 'avatar-13', 'avatar-14', 'avatar-15',
    'avatar-16', 'avatar-17', 'avatar-18', 'avatar-19', 'avatar-20'
];

const avatars = seeds.map(seed => createAvatar(style, { seed }));

const AvatarModal = ({ isOpen, onRequestClose, onSelectAvatar }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center ">
                <h2 className="text-xl font-bold mb-4">Selecciona tu Avatar</h2>
                <div className="grid grid-cols-4 gap-4">
                    {avatars.map((avatar, index) => (
                        <div
                            key={index}
                            dangerouslySetInnerHTML={{ __html: avatar }}
                            className="w-24 h-24 rounded-full cursor-pointer"
                            onClick={() => onSelectAvatar(avatar)}
                        />
                    ))}
                </div>
                <button onClick={onRequestClose} className=" mt-4 px-4 py-2 bg-red-500 text-white rounded ">
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default AvatarModal;
