'use client';

import { store } from '@/redux/store/store';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';

export default function ReduxProvider({ children }) {
    return <SessionProvider>
        <Provider store={store}>{children}</Provider>
    </SessionProvider>

}
