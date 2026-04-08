import { Pagination } from './Pagination';
import { PageSizeSelector } from './PageSizeSelector';

/**
 * Componente exemplo de lista com paginação
 * USO:
 * const { turnes, pagination, loading, setPageSize, nextPage, prevPage, goToPage } = useTurnesWithPagination();
 * return <PaginatedList items={turnes} pagination={pagination} ... />
 */
export const PaginatedList = ({
  items = [],
  pagination = {},
  loading = false,
  onNextPage = () => {},
  onPrevPage = () => {},
  onGoToPage = () => {},
  onPageSizeChange = () => {},
  renderItem = (item) => <div>{item.id}</div>,
  title = 'Lista',
  emptyMessage = 'Nenhum item encontrado',
}) => {
  if (pagination.empty && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com título e seletor de tamanho */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <PageSizeSelector
          pageSize={pagination.pageSize || 10}
          onPageSizeChange={onPageSizeChange}
          disabled={loading}
        />
      </div>

      {/* Conteúdo */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin">
              <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition">
              {renderItem(item)}
            </div>
          ))
        )}
      </div>

      {/* Paginação */}
      <Pagination
        pagination={pagination}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        onGoToPage={onGoToPage}
        disabled={loading}
      />

      {/* Info de paginação */}
      {!loading && (
        <div className="text-sm text-gray-600 text-center">
          Mostrando {items.length} de {pagination.totalElements || 0} itens
        </div>
      )}
    </div>
  );
};
