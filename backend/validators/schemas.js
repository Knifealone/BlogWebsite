const { z } = require('zod');
const { DEVICES, POST_STATUSES, POST_TYPES, PORTFOLIO_CATEGORIES } = require('../config/constants');

const trimmed = (max) => z.string().trim().max(max);

/** Only our own uploads or a secure link: blocks javascript: and data: URLs. */
const imageUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) => value === '' || value.startsWith('/uploads/') || /^https:\/\/\S+$/.test(value),
    'Use an uploaded image or a link that starts with https://',
  );

const dateString = z
  .string()
  .trim()
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Enter a valid date');

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
});

const postSchema = z
  .object({
    type: z.enum(POST_TYPES),
    title: z.string().trim().min(1, 'Title is required').max(140),
    excerpt: trimmed(400).default(''),
    content: z.string().max(50000).default(''),
    category: z.enum(PORTFOLIO_CATEGORIES).nullable().optional(),
    price: trimmed(20).default(''),
    readTime: trimmed(30).default(''),
    coverImage: imageUrl.default(''),
    metadata: z
      .object({
        camera: trimmed(80).default(''),
        lens: trimmed(80).default(''),
        settings: trimmed(80).default(''),
      })
      .default({ camera: '', lens: '', settings: '' }),
    status: z.enum(POST_STATUSES).default('draft'),
    publishedAt: dateString.nullable().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.type === 'portfolio' && !value.category) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['category'],
        message: 'Choose a category for portfolio items',
      });
    }
  });

const commentSchema = z.object({
  author: z.string().trim().min(1, 'Name is required').max(60),
  text: z.string().trim().min(1, 'Comment is required').max(1000),
});

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Enter a valid email').max(254),
  message: z.string().trim().min(1, 'Message is required').max(3000),
  /** Honeypot: real visitors never see or fill this field. */
  website: z.string().max(200).optional().default(''),
});

const mediaUpdateSchema = z.object({
  alt: trimmed(300),
});

const messageUpdateSchema = z.object({
  read: z.boolean(),
});

const trackSchema = z.object({
  path: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .refine((value) => value.startsWith('/'), 'Path must start with /'),
  referrer: trimmed(500).optional().default(''),
  internal: z.boolean().optional().default(false),
});

const publicPostsQuery = z.object({
  type: z.enum(POST_TYPES).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const adminPostsQuery = z.object({
  type: z.enum(POST_TYPES).optional(),
  status: z.enum(POST_STATUSES).optional(),
});

const logsQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  days: z.coerce.number().int().min(1).max(90).default(7),
  q: trimmed(100).optional().default(''),
  device: z.enum(DEVICES).optional(),
});

const statsQuery = z.object({
  days: z.coerce.number().int().min(1).max(90).default(7),
});

const exportQuery = z.object({
  days: z.coerce.number().int().min(1).max(90).default(7),
});

module.exports = { loginSchema, postSchema, commentSchema, contactSchema, mediaUpdateSchema, messageUpdateSchema, trackSchema, publicPostsQuery, adminPostsQuery, logsQuery, statsQuery, exportQuery };
