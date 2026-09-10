import { windChimeRoutes } from '@/lib/windchime';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const GET = (req: Request) => windChimeRoutes.GET(req);
export const POST = (req: Request) => windChimeRoutes.POST(req);
export const PUT = (req: Request) => windChimeRoutes.PUT(req);
export const PATCH = (req: Request) => windChimeRoutes.PATCH(req);
export const DELETE = (req: Request) => windChimeRoutes.DELETE(req);
