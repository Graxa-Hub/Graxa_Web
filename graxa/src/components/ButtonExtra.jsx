// BOTÃO PARA O LOGIN EM CASO DE:
// ESQUECI A SENHA, JÁ ESTÁ CADASTRADO, ETC...

export const ButtonExtra = ({children, className}) => {
    return (
        <button className={`bg-transparent text-sm text-gray-900 font-semibold outline-none ${className}`}>{children}</button>
    );
}