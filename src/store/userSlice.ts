import { User } from '@/models/user.interface';
import api from '@/utils/api';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    user: User | null;
}

const getMe = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 401) {
            window.location.href = '/auth/login';
        }

        return response.data.data;
    }
    return null;
};

const initialState: UserState = {
    user: await getMe(),
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        logout(state) {
            state.user = null;
        },
    },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
