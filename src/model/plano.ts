import { DatabaseModel } from "./DataBaseModel.js";
import type { PlanoDTO } from "../interface/PlanoDTO.js";

const database = new DatabaseModel().pool;

class Plano {

  private codPlano:number = 0;
  private nomePlano:string;
  private valor:number;
  private descricao?:string;
  private statusPlano:string;

  constructor(
    _nomePlano:string,
    _duracaoDias:number,
    _valor:number,
    _statusPlano:string,
    _descricao?:string
  ){
    this.nomePlano = _nomePlano;
    this.valor = _valor;
    this.statusPlano = _statusPlano;
    this.descricao = _descricao || '';
  }

  public getCodPlano():number{
    return this.codPlano;
  }

  public setCodPlano(codPlano:number):void{
    this.codPlano = codPlano;
  }

  public getNomePlano():string{
    return this.nomePlano;
  }

  public setNomePlano(nome:string):void{
    this.nomePlano = nome;
  }

  public getValor():number{
    return this.valor;
  }

  public setValor(valor:number):void{
    this.valor = valor;
  }

  public getDescricao():string | undefined{
    return this.descricao;
  }

  public setDescricao(descricao:string):void{
    this.descricao = descricao;
  }

  public getStatusPlano():string{
    return this.statusPlano;
  }

  public setStatusPlano(status:string):void{
    this.statusPlano = status;
  }


  static async listarPlanos():Promise<Array<Plano> | null>{
    try{

      const lista:Array<Plano> = [];

      const query = `SELECT * FROM Plano ORDER BY nome_plano ASC;`;

      const respostaBD = await database.query(query);

      respostaBD.rows.forEach((planoBD:any)=>{

        const plano = new Plano(
          planoBD.nome_plano,
          planoBD.duracao_dias,
          planoBD.valor,
          planoBD.status_plano,
          planoBD.descricao
        );

        plano.setCodPlano(planoBD.cod_plano);

        lista.push(plano);
      });

      return lista;

    }catch(error){
      console.error("Erro ao listar planos", error);
      return null;
    }
  }

  static async cadastrarPlano(plano: PlanoDTO): Promise<boolean> {
    try {
        const query = `
            INSERT INTO plano
            (nome_plano, duracao_dias, valor, descricao, status_plano)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING cod_plano;
        `;

        const respostaBD = await database.query(query, [
          plano.tipo_plano,
            plano.valor,
            plano.descricao,
            plano.status_plano
        ]);

        if (respostaBD.rows.length > 0) {
            console.info(`Plano cadastrado com sucesso. ID: ${respostaBD.rows[0].cod_plano}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error(`Erro ao cadastrar plano. ${error}`);
        return false;
    }
}

  static async listarPlano(codPlano:number):Promise<Plano | null>{
    try{

      const query = `SELECT * FROM Plano WHERE cod_plano=$1`;

      const respostaBD = await database.query(query,[codPlano]);

      if(respostaBD.rowCount){

        const planoBD = respostaBD.rows[0];

        const plano = new Plano(
          planoBD.nome_plano,
          planoBD.duracao_dias,
          planoBD.valor,
          planoBD.status_plano,
          planoBD.descricao
        );

        plano.setCodPlano(planoBD.cod_plano);

        return plano;
      }

      return null;

    }catch(error){
      console.error("Erro ao buscar plano",error);
      return null;
    }
  }
}

export default Plano;