import React, { useState, useEffect } from 'react';
import styles from './toast.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@store';
import { useDispatch } from 'react-redux';

export const GlobalToast: React.FC = () => {
	// const toastData = useSelector((state: RootState) => state.ui.toast);
	const toastData = {
		isOpen: false,
		message: 'Hello, World!',
		type: 'success',
		duration: 3000,
	};
	const dispatch = useDispatch();
	const timeDependency = toastData.duration ?? 3000;
	const toastTypeClass = styles[toastData.type];
	useEffect(() => {
		const timer = setTimeout(() => {
			// dispatch(setToast({ ...toastData, isOpen: false }));
		}, timeDependency);

		return () => {
			clearTimeout(timer);
		};
	}, [timeDependency, dispatch]);

	return toastData.isOpen ? (
		<div className={`${styles.toast} ${toastTypeClass} text-primary`}>
			<p className={styles.message}>{toastData.message}</p>
		</div>
	) : null;
};
