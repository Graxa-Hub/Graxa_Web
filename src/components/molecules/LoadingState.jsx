import { Layout } from "../templates/Layout";

export function LoadingState() {
    return (
        <Layout>
            <div className="flex items-center justify-center flex-1">
                <p className="text-gray-500">Carregando...</p>
            </div>
        </Layout>
    );
}
