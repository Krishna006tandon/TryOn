import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to TryOn!</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
                        Please log in or sign up to continue your shopping experience.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Link to="/login" onClick={onClose}>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400">
                            Login
                        </Button>
                    </Link>
                    <Link to="/signup" onClick={onClose}>
                        <Button variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900 dark:hover:text-indigo-300">
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
