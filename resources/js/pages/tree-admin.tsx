import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function TreeAdmin() {
    return (
        <AppLayout>
            <Head title="Tree Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                Tree Admin
            </div>
        </AppLayout>
    );
}
