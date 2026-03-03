import SimulationSchema from '../db/simulation.js';

import answerShell from '../middlewares/answerShell.js';
import errorLog from '../middlewares/errorLog.js';

import { calculateFixedIncome, calculateVariableIncome, calculateComparison } from '../services/calculations.js';

export async function createSimulation(req, res, next) {
  try {
    const payload = req.body;
    const userId = req.userId;

    const requiredFields = [
      'name',
      'initialAmount',
      'monthlyContribution',
      'periodMonths',
      'fixedAnnualRate',
      'variableAnnualReturn',
      'volatility'
    ];

    for (const field of requiredFields) {
      if (payload[field] === undefined || payload[field] === null) {
        return res.json(answerShell({}, `Campo obrigatório ausente: ${field}`, false));
      }
    }

    const fixedIncomeResults = calculateFixedIncome({
      initialAmount: payload.initialAmount,
      monthlyContribution: payload.monthlyContribution,
      periodMonths: payload.periodMonths,
      annualRate: payload.fixedAnnualRate
    });

    const variableIncomeResults = calculateVariableIncome({
      initialAmount: payload.initialAmount,
      monthlyContribution: payload.monthlyContribution,
      periodMonths: payload.periodMonths,
      annualReturn: payload.variableAnnualReturn,
      volatility: payload.volatility
    });

    const comparisonResults = calculateComparison(
      fixedIncomeResults.finalAmount,
      variableIncomeResults.finalAmount
    );

    const simulation = new SimulationSchema({
      userId,
      name: payload.name,
      initialAmount: payload.initialAmount,
      monthlyContribution: payload.monthlyContribution,
      periodMonths: payload.periodMonths,
      fixedAnnualRate: payload.fixedAnnualRate,
      variableAnnualReturn: payload.variableAnnualReturn,
      volatility: payload.volatility,
      results: {
        fixedIncome: fixedIncomeResults,
        variableIncome: variableIncomeResults,
        comparison: {
          differencePercent: comparisonResults
        }
      }
    });

    await simulation.save();

    return res.json(
      answerShell(
        { simulation },
        'Simulação criada com sucesso',
        true
      )
    );
  } catch (err) {
    await errorLog(`Simulation createSimulation ${err.message}`);
    next(err);
    return res.json(answerShell({}, err.message, false));
  }
}

export async function listSimulations(req, res, next) {
  try {
    const userId = req.userId;

    const simulations = await SimulationSchema
      .find({ userId })
      .select('_id name createdAt')
      .sort({ createdAt: -1 });

    return res.json(
      answerShell(
        simulations,
        'Simulações listadas com sucesso',
        true
      )
    );
  } catch (err) {
    await errorLog(`Simulation listSimulations ${err.message}`);
    next(err);
    return res.json(answerShell({}, err.message, false));
  }
}

export async function getSimulation(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const simulation = await SimulationSchema.findOne({ _id: id, userId });

    if (!simulation) {
      return res.json(answerShell({}, 'Simulação não encontrada', false));
    }

    return res.json(
      answerShell(
        simulation,
        'Simulação recuperada com sucesso',
        true
      )
    );
  } catch (err) {
    await errorLog(`Simulation getSimulation ${err.message}`);
    next(err);
    return res.json(answerShell({}, err.message, false));
  }
}

export async function deleteSimulation(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const simulation = await SimulationSchema.findOneAndDelete({ _id: id, userId });

    if (!simulation) {
      return res.json(answerShell({}, 'Simulação não encontrada', false));
    }

    return res.json(
      answerShell(
        {},
        'Simulação deletada com sucesso',
        true
      )
    );
  } catch (err) {
    await errorLog(`Simulation deleteSimulation ${err.message}`);
    next(err);
    return res.json(answerShell({}, err.message, false));
  }
}
