import { Schema, model } from 'mongoose';

const SimulationSchema = new Schema(
  {
    name: { type: String, required: true },

    initialAmount: { type: Number, required: true },
    monthlyContribution: { type: Number, default: 0 },
    periodMonths: { type: Number, required: true },

    fixedAnnualRate: Number,
    variableAnnualReturn: Number,
    volatility: Number,

    results: {
      fixedIncome: {
        finalAmount: Number,
        totalInvested: Number,
        grossProfit: Number,
        netProfit: Number,
        ir: Number,
        iof: Number,
        monthlyEvolution: [
          {
            month: Number,
            value: Number
          }
        ]
      },

      variableIncome: {
        finalAmount: Number,
        totalInvested: Number,
        grossProfit: Number,
        monthlyEvolution: [
          {
            month: Number,
            value: Number
          }
        ]
      },

      comparison: {
        differencePercent: Number
      }
    },
  },
  { timestamps: true },
);

export default model('simulations', SimulationSchema);
