export interface MatriculaDTO {
    cod_aluno: number;
    cod_plano: number;
    data_matricula: Date;
    data_vencimento?: Date;
    valor_pago: number;
    status_matricula: string;
}