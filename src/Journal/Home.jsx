import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'firebaseui/dist/firebaseui.css'


export default function Home() {
    const navigate = useNavigate()
    useEffect(() => {
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
        console.log(ui)

        ui.start('#firebaseui-auth-container', {
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        signInFlow: 'popup',
        callbacks: {
            signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                console.log("Login successful!");
                navigate('/journal');                 
                return false; 
            },
        },
        });
    },[navigate])

    
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tighter">
                Home
            </h1>
            <div id='firebaseui-auth-container'></div>
            
        </div>
    );
}