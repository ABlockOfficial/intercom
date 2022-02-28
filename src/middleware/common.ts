import compression from 'compression';
import express, { RequestHandler, Router } from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { DEL_RATE_LIMIT, GET_RATE_LIMIT, SET_RATE_LIMIT } from '../constants';

const handleCommon = (router: Router) => {
    router.use(cors());
    // TODO: What is a reasonable size for a request body limit?
    router.use(express.json({ limit: '50kb' }) as RequestHandler);
    router.use(express.urlencoded({ extended: true }) as RequestHandler);
    router.use(compression());
};

const handleRateLimit = (router: Router) => {
    const getDataLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: GET_RATE_LIMIT,
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: 'Too many requests, please try again later'
    });
    const setDataLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: SET_RATE_LIMIT,
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: 'Too many requests, please try again later'
    });
    const delDataLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: DEL_RATE_LIMIT,
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: 'Too many requests, please try again later'
    });
    router.use('/get_data', getDataLimiter);
    router.use('/set_data', setDataLimiter);
    router.use('/del_data', delDataLimiter);
};

export default [handleCommon, handleRateLimit];