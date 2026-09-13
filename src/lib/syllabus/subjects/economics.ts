import type { Subject } from "../types";

/** IB Economics: guide for first assessment 2022, four units framed around nine key concepts and real-world issues. Topic codes, labels and library slugs match RevisionDojo's resource library (read 13 Sep 2026). */
export const ECONOMICS: Subject = {
  id: "ib-economics",
  name: "Economics",
  short: "Econ",
  slug: "ib-economics",
  tint: "warning",
  units: [
    {
      id: "u1-intro",
      label: "Unit 1 - Introduction to economics",
      topics: [
        {
          id: "u1-1-what-is-economics",
          code: "1.1",
          label: "What is economics?",
          slug: "ib-economics-11-what-is-economics",
          misconceptions: [
            "Scarcity means poverty (it means limited resources against unlimited wants, and applies to everyone).",
            "Opportunity cost is the money price of something (it is the next best alternative given up).",
            "Economics is only about money.",
          ],
          objectives: [
            "Explain scarcity and why it forces choice",
            "Explain opportunity cost with an everyday example",
            "Distinguish economics as a social science from a natural science",
          ],
          criteria: {
            "Explain scarcity and why it forces choice": ["resources are finite", "wants are unlimited", "so not everything can be produced and choices must be made"],
            "Explain opportunity cost with an everyday example": ["opportunity cost is the next best alternative given up", "an everyday example of choosing one thing and losing another", "it exists whenever resources are limited"],
            "Distinguish economics as a social science from a natural science": ["economics studies human behaviour and choices", "controlled experiments are hard, so it relies on models and assumptions", "natural sciences test laws with repeatable experiments"],
          },
        },
        {
          id: "u1-2-how-economists-approach",
          code: "1.2",
          label: "How do economists approach the world?",
          slug: "ib-economics-12-how-do-economists-approach-the-world",
          misconceptions: [
            "A model is wrong because it is unrealistic (models simplify deliberately; ceteris paribus isolates one relationship at a time).",
            "Normative statements can be proved true with enough data (they rest on value judgements, so evidence alone cannot settle them).",
            "Economics gives one right answer to every policy question (different schools weigh efficiency, equity and freedom differently).",
          ],
          objectives: [
            "Distinguish positive economics from normative economics",
            "Explain why economists build models and use ceteris paribus",
            "Outline the nine central concepts that frame the IB economics course",
          ],
          criteria: {
            "Distinguish positive economics from normative economics": ["a positive statement describes what is and can in principle be tested against evidence", "a normative statement expresses what ought to be and rests on a value judgement", "one example of each, such as a rise in the minimum wage raises unemployment versus the minimum wage should be raised"],
            "Explain why economists build models and use ceteris paribus": ["the real economy has too many variables to study all at once", "a model simplifies by keeping all other factors constant while one is changed", "ceteris paribus means other things equal, so one cause can be isolated"],
            "Outline the nine central concepts that frame the IB economics course": ["names several, such as scarcity, choice, efficiency, equity, well-being, sustainability, change, interdependence, intervention", "explains that the concepts are lenses for looking at any real-world issue", "gives one example of a concept applied to a real-world issue"],
          },
        },
      ],
    },
    {
      id: "u2-micro",
      label: "Unit 2 - Microeconomics",
      topics: [
        {
          id: "u2-1-demand",
          code: "2.1",
          label: "Demand",
          slug: "ib-economics-21-demand",
          misconceptions: [
            "When price falls, demand rises (quantity demanded rises; the demand curve itself does not shift).",
            "Demand means what people want, regardless of ability to pay.",
            "A change in price shifts the demand curve (it causes movement along it).",
          ],
          objectives: [
            "Explain the law of demand",
            "Distinguish a movement along the demand curve from a shift of the curve",
            "Outline three non-price determinants of demand",
          ],
          criteria: {
            "Explain the law of demand": ["as price rises quantity demanded falls, other things equal", "the income effect: buying power falls as price rises", "the substitution effect: buyers switch to cheaper alternatives"],
            "Distinguish a movement along the demand curve from a shift of the curve": ["a movement along the curve is caused by a change in the good's own price", "a shift is caused by a non-price determinant", "a shift changes the quantity demanded at every price"],
            "Outline three non-price determinants of demand": ["names three determinants, such as income, prices of related goods, tastes, expectations or population", "says which way at least one of them shifts the curve"],
          },
        },
        {
          id: "u2-2-supply",
          code: "2.2",
          label: "Supply",
          slug: "ib-economics-22-supply",
          misconceptions: [
            "A rise in price shifts the supply curve (it causes a movement along the curve).",
            "Firms supply more at high prices only because they are greedy (higher prices cover rising marginal costs and attract new firms).",
            "A subsidy shifts supply to the left (a subsidy lowers costs, so supply shifts right).",
          ],
          objectives: [
            "Explain the law of supply",
            "Distinguish a movement along the supply curve from a shift of the curve",
            "Outline three non-price determinants of supply",
          ],
          criteria: {
            "Explain the law of supply": ["as price rises quantity supplied rises, other things equal", "a higher price makes production more profitable at the margin", "higher prices also attract new firms into the market in the long run"],
            "Distinguish a movement along the supply curve from a shift of the curve": ["a movement along the curve is caused by a change in the good's own price", "a shift is caused by a non-price determinant of supply", "a shift changes the quantity supplied at every price"],
            "Outline three non-price determinants of supply": ["names three, such as costs of production, technology, taxes, subsidies, prices of related goods or the number of firms", "says which way at least one of them shifts the curve"],
          },
        },
        {
          id: "u2-3-market-equilibrium",
          code: "2.3",
          label: "Competitive market equilibrium",
          slug: "ib-economics-23-competitive-market-equilibrium",
          misconceptions: [
            "A shortage means the good has run out permanently (it is a temporary excess demand that the rising price removes).",
            "Price is set by producers alone (equilibrium price comes from the interaction of demand and supply).",
            "Equilibrium means everyone who wants the good gets it (only those willing and able to pay the market price do).",
          ],
          objectives: [
            "Explain how market equilibrium is reached",
            "Explain how the price mechanism signals, rations and gives incentives",
            "Explain consumer surplus and producer surplus at equilibrium",
          ],
          criteria: {
            "Explain how market equilibrium is reached": ["equilibrium is where quantity demanded equals quantity supplied", "above equilibrium there is excess supply, so price is bid down", "below equilibrium there is excess demand, so price is bid up"],
            "Explain how the price mechanism signals, rations and gives incentives": ["price signals to producers where consumers want resources to go", "price rations the scarce good among those willing and able to pay", "price gives producers the incentive to move resources into the profitable market"],
            "Explain consumer surplus and producer surplus at equilibrium": ["consumer surplus is the gap between what consumers are willing to pay and what they do pay", "producer surplus is the gap between the price received and the minimum price producers would accept", "at the free-market equilibrium the sum of the two surpluses, the social surplus, is maximised"],
          },
        },
        {
          id: "u2-4-critique-maximizing",
          code: "2.4",
          label: "Critique of the maximizing behaviour of consumers and producers (HL only)",
          slug: "ib-economics-24-critique-of-the-maximizing-behaviour-of-consumers-and-11048",
          misconceptions: [
            "Behavioural economics says people are stupid (it says people are boundedly rational and use rules of thumb under limited time and information).",
            "A nudge removes choice (a nudge changes the default or framing while leaving every option available).",
            "Firms always maximise profit (many pursue market share, revenue, satisficing or social objectives).",
          ],
          objectives: [
            "Explain the assumptions of rational consumer choice and why they are challenged",
            "Outline behavioural insights such as bounded rationality, biases and choice architecture",
            "Explain why firms may pursue objectives other than profit maximisation",
          ],
          criteria: {
            "Explain the assumptions of rational consumer choice and why they are challenged": ["the standard model assumes consumers have perfect information and consistent preferences and maximise utility", "in reality information is imperfect and processing it is costly, so rationality is bounded", "people rely on rules of thumb and are influenced by how choices are framed"],
            "Outline behavioural insights such as bounded rationality, biases and choice architecture": ["bounded rationality means people satisfice rather than optimise", "biases such as anchoring, availability or loss aversion distort decisions", "choice architecture and default options change behaviour without removing choice, as in nudges"],
            "Explain why firms may pursue objectives other than profit maximisation": ["managers may pursue growth, market share or revenue rather than maximum profit", "ownership is often separated from control, so managers' incentives differ from owners'", "firms may pursue corporate social responsibility or environmental objectives"],
          },
        },
        {
          id: "u2-5-elasticity",
          code: "2.5",
          label: "Elasticities of demand",
          slug: "ib-economics-25-elasticities-of-demand",
          misconceptions: [
            "A good is elastic because everyone needs it (necessities are typically INelastic).",
            "Elasticity is the slope of the demand curve (it is a ratio of percentage changes and varies along a straight line).",
            "Elastic demand means demand is large.",
          ],
          objectives: [
            "Explain what price elasticity of demand measures",
            "Explain why necessities tend to have price-inelastic demand",
            "Explain how PED affects total revenue when price changes",
          ],
          criteria: {
            "Explain what price elasticity of demand measures": ["the responsiveness of quantity demanded to a change in price", "calculated as percentage change in quantity demanded divided by percentage change in price", "elastic if greater than one, inelastic if less than one"],
            "Explain why necessities tend to have price-inelastic demand": ["necessities have few close substitutes", "people need them regardless of price", "so quantity demanded changes little when the price rises"],
            "Explain how PED affects total revenue when price changes": ["total revenue is price times quantity", "with inelastic demand a price rise raises revenue", "with elastic demand a price rise lowers revenue"],
          },
        },
        {
          id: "u2-6-elasticity-of-supply",
          code: "2.6",
          label: "Elasticity of supply",
          slug: "ib-economics-26-elasticity-of-supply",
          misconceptions: [
            "Supply is inelastic because the firm does not want to produce more (it is because capacity and factor mobility limit how fast output can rise).",
            "PES is negative when supply falls (PES is normally positive because price and quantity supplied move together).",
            "Supply elasticity is the same in the short run and the long run (supply is more elastic in the long run as capacity can be changed).",
          ],
          objectives: [
            "Explain what price elasticity of supply measures",
            "Explain the determinants of price elasticity of supply",
            "Explain why primary commodities tend to have inelastic supply",
          ],
          criteria: {
            "Explain what price elasticity of supply measures": ["the responsiveness of quantity supplied to a change in price", "calculated as percentage change in quantity supplied divided by percentage change in price", "elastic if greater than one, inelastic if less than one"],
            "Explain the determinants of price elasticity of supply": ["time is the key determinant: supply is more elastic the longer the time period", "spare capacity and the ability to store stock raise elasticity", "the mobility of factors of production and ease of entering the industry raise elasticity"],
            "Explain why primary commodities tend to have inelastic supply": ["crops and minerals take a long time to grow or extract", "output cannot be raised quickly in response to a price rise", "so price changes cause large price swings rather than large quantity changes"],
          },
        },
        {
          id: "u2-7-role-of-government",
          code: "2.7",
          label: "Role of government in microeconomics",
          slug: "ib-economics-27-role-of-government-in-microeconomics",
          misconceptions: [
            "A price ceiling always makes consumers better off (it creates shortages, queues and parallel markets, so some consumers get nothing).",
            "A producer pays the whole of an indirect tax (the burden is shared with consumers according to the relative elasticities of demand and supply).",
            "A price floor on wages helps every worker (a minimum wage above equilibrium can create excess supply of labour, that is unemployment).",
          ],
          objectives: [
            "Explain the effects of a price ceiling set below equilibrium",
            "Explain the effects of a price floor set above equilibrium",
            "Explain how the incidence of an indirect tax depends on elasticity",
          ],
          criteria: {
            "Explain the effects of a price ceiling set below equilibrium": ["a maximum price below equilibrium creates excess demand, that is a shortage", "shortages lead to queues, rationing and parallel or black markets", "it is intended to make a necessity affordable, one example, such as rent controls or staple food prices"],
            "Explain the effects of a price floor set above equilibrium": ["a minimum price above equilibrium creates excess supply, that is a surplus", "the government may buy up and store the surplus, at a cost to taxpayers", "one example, such as agricultural price support or a national minimum wage"],
            "Explain how the incidence of an indirect tax depends on elasticity": ["an indirect tax shifts the supply curve upwards by the amount of the tax", "the more inelastic the demand relative to supply, the greater the share borne by consumers", "the tax creates a welfare loss because output falls below the free-market level"],
          },
        },
        {
          id: "u2-8-externalities",
          code: "2.8",
          label: "Market failure: externalities and common pool resources",
          slug: "ib-economics-28-market-failure-externalities-common-pool-resources-pu-11051",
          misconceptions: [
            "All externalities are negative (there are positive externalities of production and consumption, such as training or vaccination).",
            "A common pool resource is the same as a public good (common pool resources are rival in consumption, public goods are not).",
            "A carbon tax works only if it stops all pollution (its aim is to internalise the external cost so output falls to the socially optimal level).",
          ],
          objectives: [
            "Explain what an externality is and how it causes market failure",
            "Distinguish negative externalities of production from positive externalities of consumption",
            "Explain why common pool resources tend to be overused",
          ],
          criteria: {
            "Explain what an externality is and how it causes market failure": ["an externality is a cost or benefit falling on a third party not involved in the transaction", "the market price reflects only private costs and benefits, so marginal social and marginal private values diverge", "output is therefore not at the socially optimal level and welfare loss results"],
            "Distinguish negative externalities of production from positive externalities of consumption": ["with a negative production externality marginal social cost exceeds marginal private cost, so the good is overproduced", "with a positive consumption externality marginal social benefit exceeds marginal private benefit, so the good is underconsumed", "one example of each, such as factory pollution and vaccination or education"],
            "Explain why common pool resources tend to be overused": ["common pool resources are rival but non-excludable, one example, such as ocean fish stocks or a common grazing land", "each user takes the private benefit while the cost of depletion is shared by all", "the result is overuse and degradation, often called the tragedy of the commons", "sustainability requires intervention such as quotas, property rights or collective management"],
          },
        },
        {
          id: "u2-9-public-goods",
          code: "2.9",
          label: "Market failure: public goods",
          slug: "ib-economics-29-market-failure-public-goods",
          misconceptions: [
            "A public good is anything provided by the government (it is defined by being non-rivalrous and non-excludable, not by who supplies it).",
            "Public goods are free to produce (they are costly to produce; they are simply not profitable to sell privately).",
            "Public transport and state schools are public goods (they are rival and excludable, so they are merit goods rather than public goods).",
          ],
          objectives: [
            "Explain what makes a good a public good",
            "Explain why the free market underprovides public goods",
            "Outline how governments provide public goods",
          ],
          criteria: {
            "Explain what makes a good a public good": ["a public good is non-rivalrous: one person's use does not reduce the amount available to others", "a public good is non-excludable: people cannot be prevented from consuming it", "one example, such as national defence, street lighting or flood defences"],
            "Explain why the free market underprovides public goods": ["because the good is non-excludable, consumers can free-ride and refuse to pay", "firms cannot charge a price and so earn no revenue, so none is provided", "this is a market failure because the good is socially desirable and would raise welfare"],
            "Outline how governments provide public goods": ["direct government provision funded from general taxation", "contracting private firms to produce the good while the state pays for it", "the government must decide the socially desirable quantity because no market price exists"],
          },
        },
        {
          id: "u2-10-asymmetric-information",
          code: "2.10",
          label: "Market failure: asymmetric information (HL only)",
          slug: "ib-economics-210-market-failure-asymmetric-information-hl-only",
          misconceptions: [
            "Asymmetric information means nobody has any information (it means one party to the transaction has more or better information than the other).",
            "Adverse selection and moral hazard are the same thing (adverse selection happens before the contract, moral hazard after it).",
            "Signalling is a form of dishonesty (signalling is the informed party credibly revealing quality, such as through a qualification or a warranty).",
          ],
          objectives: [
            "Explain how asymmetric information leads to market failure",
            "Distinguish adverse selection from moral hazard",
            "Outline responses to asymmetric information by governments and by private parties",
          ],
          criteria: {
            "Explain how asymmetric information leads to market failure": ["one party in the transaction has more or better information than the other", "resources are therefore misallocated because prices do not reflect true quality or risk", "one example, such as a used car market or a health insurance market"],
            "Distinguish adverse selection from moral hazard": ["adverse selection happens before the deal, when the better-informed party self-selects and good quality leaves the market", "moral hazard occurs after the transaction, when one party takes more risk because another bears the cost", "one example of each, such as high-risk buyers dominating insurance and an insured driver taking less care"],
            "Outline responses to asymmetric information by governments and by private parties": ["signalling by the informed party, such as qualifications, warranties or brand reputation", "screening by the uninformed party, such as insurers requiring medical checks", "government regulation, licensing and mandatory disclosure of information"],
          },
        },
        {
          id: "u2-11-market-power",
          code: "2.11",
          label: "Market failure: market power (HL only)",
          slug: "ib-economics-211-market-failure-market-power-hl-only",
          misconceptions: [
            "A monopoly can charge any price it likes (it is still limited by the demand curve, so a higher price means lower quantity sold).",
            "A monopoly always makes abnormal profit (barriers to entry allow it in the long run, but a monopoly can still make a loss).",
            "Perfect competition exists in the real world (it is a theoretical benchmark used to judge real markets).",
          ],
          objectives: [
            "Explain how market power leads to allocative inefficiency",
            "Distinguish perfect competition from monopoly",
            "Outline how governments respond to firms with market power",
          ],
          criteria: {
            "Explain how market power leads to allocative inefficiency": ["a firm with market power is a price maker and faces a downward-sloping demand curve", "it restricts output and raises price above marginal cost, so price exceeds marginal cost", "this creates a welfare loss and transfers surplus from consumers to the firm"],
            "Distinguish perfect competition from monopoly": ["perfect competition has many small firms, a homogeneous product, free entry and price-taking firms", "monopoly has a single seller, high barriers to entry and a price-making firm", "in the long run perfectly competitive firms earn only normal profit, while a monopoly can keep abnormal profit"],
            "Outline how governments respond to firms with market power": ["competition or antitrust law that blocks mergers and bans collusion and abuse of a dominant position", "regulation of prices or profits in a natural monopoly", "nationalisation or the opening of markets to new entrants and trade"],
          },
        },
        {
          id: "u2-12-equity",
          code: "2.12",
          label: "The market's inability to achieve equity (HL only)",
          slug: "ib-economics-212-the-markets-inability-to-achieve-equity-hl-only",
          misconceptions: [
            "Equity and equality mean the same thing (equity is about fairness, which may not require identical outcomes).",
            "Markets always produce fair outcomes if they are efficient (an efficient allocation can still leave people in severe poverty).",
            "Progressive taxation means everyone pays the same proportion of income (that is a proportional tax; progressive means the rate rises with income).",
          ],
          objectives: [
            "Distinguish equity from equality in the distribution of income",
            "Explain why the market alone does not achieve an equitable distribution of income",
            "Outline government policies that redistribute income and wealth",
          ],
          criteria: {
            "Distinguish equity from equality in the distribution of income": ["equality means the same outcome or the same amount for everyone", "equity means fairness or justice in the distribution, which may not be an equal split", "an efficient market outcome can still be regarded as inequitable"],
            "Explain why the market alone does not achieve an equitable distribution of income": ["income depends on ownership of factors of production, which is unevenly distributed", "differences in education, health, inheritance and market power reproduce inequality", "the market rewards purchasing power, not need, so some basic needs go unmet"],
            "Outline government policies that redistribute income and wealth": ["progressive income taxes and taxes on wealth, inheritance or capital gains", "transfer payments such as pensions, unemployment benefits and child allowances", "provision of merit goods and services such as health care and education"],
          },
        },
      ],
    },
    {
      id: "u3-macro",
      label: "Unit 3 - Macroeconomics",
      topics: [
        {
          id: "u3-1-measuring-economic-activity",
          code: "3.1",
          label: "Measuring economic activity",
          slug: "ib-economics-31-measuring-economic-activities",
          misconceptions: [
            "A rise in nominal GDP always means the country produced more (it may only reflect higher prices; real GDP adjusts for inflation).",
            "GDP per capita measures how well off every person is (it is a mean, so it hides distribution, unpaid work and the informal economy).",
            "GDP and GNI are the same thing (GNI adds net property income from abroad to GDP).",
          ],
          objectives: [
            "Explain what GDP measures using the circular flow of income",
            "Distinguish nominal GDP from real GDP and GDP from GNI",
            "Evaluate national income statistics as a measure of well-being",
          ],
          criteria: {
            "Explain what GDP measures using the circular flow of income": ["GDP is the total value of all final goods and services produced in an economy in a year", "the circular flow shows income, output and expenditure as three equal ways of measuring the same flow", "leakages are savings, taxes and imports; injections are investment, government spending and exports"],
            "Distinguish nominal GDP from real GDP and GDP from GNI": ["nominal GDP is measured at current prices, real GDP is adjusted for inflation using a price deflator", "real GDP shows whether output actually rose", "GNI adds net property income from abroad to GDP, so it measures income earned by a country's residents"],
            "Evaluate national income statistics as a measure of well-being": ["GDP per capita says nothing about how income is distributed", "it omits unpaid and informal work and takes no account of leisure", "it ignores externalities and resource depletion, so measures such as the OECD Better Life Index are used alongside it"],
          },
        },
        {
          id: "u3-2-ad-as",
          code: "3.2",
          label: "Variations in economic activity: aggregate demand and aggregate supply",
          slug: "ib-economics-32-variations-in-economic-activity-aggregate-demand-and-11034",
          misconceptions: [
            "AD slopes down because goods are dearer than substitutes (substitution is a microeconomic idea; AD falls through the wealth, interest rate and international trade effects).",
            "The economy is always at full employment (in the short run it can sit in a deflationary or inflationary gap).",
            "A rise in the price level shifts the AD curve (it causes a movement along it).",
          ],
          objectives: [
            "Explain the components of aggregate demand and why the AD curve slopes downwards",
            "Distinguish short-run aggregate supply from long-run aggregate supply",
            "Explain how shifts in AD or AS change equilibrium output and the price level",
          ],
          criteria: {
            "Explain the components of aggregate demand and why the AD curve slopes downwards": ["AD is consumption plus investment plus government spending plus net exports", "a higher price level reduces the real value of wealth, so consumption falls", "a higher price level raises interest rates and makes exports less competitive, so investment and net exports fall"],
            "Distinguish short-run aggregate supply from long-run aggregate supply": ["SRAS slopes upwards because in the short run wages and other factor prices are sticky", "the monetarist LRAS is vertical at full employment output, set by the quantity and quality of factors of production", "the Keynesian AS curve is horizontal when there is spare capacity and vertical at full capacity"],
            "Explain how shifts in AD or AS change equilibrium output and the price level": ["a rise in AD raises real output and the price level when there is spare capacity", "a fall in SRAS, one example, such as a rise in oil prices, causes stagflation: lower output with a higher price level", "a deflationary gap has output below full employment; an inflationary gap has AD beyond full capacity so only prices rise"],
          },
        },
        {
          id: "u3-3-macro-objectives",
          code: "3.3",
          label: "Macroeconomic objectives",
          slug: "ib-economics-33-macroeconomic-objectives",
          misconceptions: [
            "Anyone without a job is unemployed (the unemployed must be willing, able and actively seeking work).",
            "Inflation means prices of everything are rising fast (it is a sustained rise in the general price level, which can be mild).",
            "Deflation is good because things get cheaper (falling prices delay spending, raise real debt and can deepen a recession).",
          ],
          objectives: [
            "Explain how unemployment is measured and outline its types",
            "Distinguish demand-pull inflation from cost-push inflation",
            "Explain the benefits and costs of economic growth",
          ],
          criteria: {
            "Explain how unemployment is measured and outline its types": ["the unemployment rate is the number unemployed as a percentage of the labour force", "the measure understates unemployment by omitting discouraged workers and the underemployed", "types include structural, frictional, seasonal and cyclical, that is demand-deficient, unemployment"],
            "Distinguish demand-pull inflation from cost-push inflation": ["inflation is a sustained rise in the general price level, measured by a consumer price index", "demand-pull inflation comes from AD rising beyond the economy's capacity", "cost-push inflation comes from a fall in SRAS, one example, such as higher oil prices or higher wages"],
            "Explain the benefits and costs of economic growth": ["growth is an increase in real GDP, shown as a shift outwards of the production possibility curve", "benefits include higher incomes, more employment and more tax revenue for public services", "costs include negative externalities, resource depletion and possibly wider income inequality"],
          },
        },
        {
          id: "u3-4-inequality-poverty",
          code: "3.4",
          label: "Economics of inequality and poverty",
          slug: "ib-economics-34-economics-of-inequality-and-poverty",
          misconceptions: [
            "Poverty and inequality are the same thing (inequality is the spread of income; poverty is falling below a standard of living).",
            "A Gini coefficient of zero means there is no poverty (it means income is shared equally, which could be equal poverty).",
            "Progressive taxes always reduce inequality regardless of what the revenue buys (redistribution depends on transfers and services funded too).",
          ],
          objectives: [
            "Explain how the Lorenz curve and the Gini coefficient measure income inequality",
            "Distinguish absolute poverty from relative poverty",
            "Outline the causes of inequality and the policies used to reduce it",
          ],
          criteria: {
            "Explain how the Lorenz curve and the Gini coefficient measure income inequality": ["the Lorenz curve plots the cumulative share of income against the cumulative share of the population", "the further the curve lies from the 45 degree line of perfect equality, the greater the inequality", "the Gini coefficient runs from 0, perfect equality, to 1, perfect inequality"],
            "Distinguish absolute poverty from relative poverty": ["absolute poverty is income below the level needed to meet basic needs, measured by an international poverty line", "relative poverty is income below a given proportion of the median income in that society", "relative poverty can persist even in a rich country as incomes grow"],
            "Outline the causes of inequality and the policies used to reduce it": ["causes include unequal ownership of wealth, differences in education and skills, discrimination and unequal access to health care", "policies include progressive taxation and transfer payments", "policies also include public provision of merit goods such as education and health care, and minimum wage legislation"],
          },
        },
        {
          id: "u3-5-monetary-policy",
          code: "3.5",
          label: "Demand management: monetary policy",
          slug: "ib-economics-35-demand-management-monetary-policy",
          misconceptions: [
            "The central bank prints money to lower interest rates (it changes the policy rate and uses open market operations to affect the money supply).",
            "Monetary policy affects the economy immediately (there are long and variable time lags before AD responds).",
            "Cutting interest rates always raises investment (in a deep recession low confidence can leave firms unwilling to borrow at any rate).",
          ],
          objectives: [
            "Explain how a central bank changes interest rates to meet its inflation target",
            "Explain the transmission of a change in interest rates to aggregate demand",
            "Evaluate the strengths and limitations of monetary policy",
          ],
          criteria: {
            "Explain how a central bank changes interest rates to meet its inflation target": ["the central bank is usually independent and has a target for inflation, commonly around two per cent", "it sets a policy or base rate and uses open market operations to buy or sell government bonds", "buying bonds raises the money supply and lowers interest rates; selling bonds does the reverse"],
            "Explain the transmission of a change in interest rates to aggregate demand": ["a lower interest rate reduces the cost of borrowing, so investment by firms rises", "it reduces the reward for saving and lowers mortgage costs, so consumption rises", "it tends to weaken the currency, so net exports rise, and the rise in AD raises output and the price level"],
            "Evaluate the strengths and limitations of monetary policy": ["strengths include flexibility, the speed with which the rate can be changed and freedom from political pressure", "limitations include time lags and the low interest rate trap where rates cannot fall much further", "in a recession weak business and consumer confidence can make demand for loans unresponsive"],
          },
        },
        {
          id: "u3-6-fiscal-policy",
          code: "3.6",
          label: "Demand management: fiscal policy",
          slug: "ib-economics-36-demand-management-fiscal-policy",
          misconceptions: [
            "A budget deficit is the same as the national debt (the deficit is one year's shortfall; the debt is the accumulated total).",
            "Government spending always raises output by the amount spent (the multiplier and crowding out can make the effect larger or smaller).",
            "Cutting taxes in a recession always works quickly (fiscal policy suffers from recognition, decision and implementation lags).",
          ],
          objectives: [
            "Explain how expansionary and contractionary fiscal policy shift aggregate demand",
            "Explain the multiplier effect of a change in government spending",
            "Evaluate the strengths and limitations of fiscal policy",
          ],
          criteria: {
            "Explain how expansionary and contractionary fiscal policy shift aggregate demand": ["fiscal policy is the government's use of its spending and taxation", "expansionary policy raises government spending or cuts taxes, shifting AD to the right to close a deflationary gap", "contractionary policy cuts spending or raises taxes, shifting AD to the left to reduce an inflationary gap"],
            "Explain the multiplier effect of a change in government spending": ["an initial injection is spent again by those who receive it, so income rises by more than the injection", "the size depends on the marginal propensity to consume domestically produced goods", "leakages into saving, taxation and imports reduce the size of the multiplier"],
            "Evaluate the strengths and limitations of fiscal policy": ["strengths include the ability to target specific sectors or regions and to build long-run capacity through investment", "automatic stabilisers such as progressive taxes and unemployment benefits moderate the cycle without a decision", "limitations include time lags, political pressure, the effect on the budget deficit and crowding out of private investment"],
          },
        },
        {
          id: "u3-7-supply-side-policies",
          code: "3.7",
          label: "Supply-side policies",
          slug: "ib-economics-37-supply-side-policies",
          misconceptions: [
            "Supply-side policies work quickly (most market-based and interventionist measures take years to raise capacity).",
            "Deregulation is always beneficial (removing regulation can worsen externalities, information problems and market power).",
            "Supply-side policies are just tax cuts (they include education, training, infrastructure and research as well).",
          ],
          objectives: [
            "Explain how supply-side policies shift the aggregate supply curve",
            "Distinguish market-based supply-side policies from interventionist ones",
            "Evaluate supply-side policies against demand-side policies",
          ],
          criteria: {
            "Explain how supply-side policies shift the aggregate supply curve": ["supply-side policies aim to raise the productive capacity of the economy", "they shift LRAS to the right, raising potential output", "output can rise without a rise in the price level, unlike a rise in AD alone"],
            "Distinguish market-based supply-side policies from interventionist ones": ["market-based policies raise competition and incentives, such as deregulation, privatisation and labour market reform", "interventionist policies use government spending on education, training, infrastructure and research and development", "interventionist policies also include industrial policy support for particular sectors"],
            "Evaluate supply-side policies against demand-side policies": ["supply-side policies can raise growth and cut inflation and unemployment at the same time", "they take a long time to work and interventionist ones are costly to the budget", "market-based measures may widen income inequality and weaken worker protection"],
          },
        },
      ],
    },
    {
      id: "u4-global",
      label: "Unit 4 - The global economy",
      topics: [
        {
          id: "u4-1-benefits-of-trade",
          code: "4.1",
          label: "Benefits of international trade",
          slug: "ib-economics-41-benefits-of-international-trade",
          misconceptions: [
            "A country with an absolute advantage in everything gains nothing from trade (comparative advantage makes trade mutually beneficial as long as opportunity costs differ).",
            "Exports are good and imports are bad (imports raise consumption possibilities and give firms cheaper inputs).",
            "Comparative advantage is about being cheapest in money terms (it is about the lower opportunity cost of production).",
          ],
          objectives: [
            "Explain the theory of comparative advantage",
            "Outline the gains from international trade",
            "Explain the limitations of the theory of comparative advantage",
          ],
          criteria: {
            "Explain the theory of comparative advantage": ["a country has a comparative advantage in a good if it can produce it at a lower opportunity cost", "each country specialises where its opportunity cost is lower and then trades", "total world output rises and both countries can consume beyond their production possibility curves"],
            "Outline the gains from international trade": ["lower prices and greater choice of goods for consumers", "economies of scale from larger markets and access to cheaper raw materials for producers", "more competition, which raises efficiency, and access to foreign technology and investment"],
            "Explain the limitations of the theory of comparative advantage": ["the model assumes no transport costs, constant returns to scale and perfect factor mobility", "comparative advantage changes over time and can be created by policy", "specialising in a narrow range of primary products leaves a country exposed to price volatility"],
          },
        },
        {
          id: "u4-2-trade-protection",
          code: "4.2",
          label: "Types of trade protection",
          slug: "ib-economics-42-types-of-trade-protection",
          misconceptions: [
            "A tariff only hurts foreign producers (domestic consumers pay a higher price and consume less, and there is a welfare loss).",
            "A subsidy to domestic producers costs the government nothing (it is paid from tax revenue, an opportunity cost).",
            "A quota raises government revenue like a tariff (the extra revenue usually goes to the importing firms holding the licences).",
          ],
          objectives: [
            "Explain the effects of a tariff on consumers, producers and the government",
            "Distinguish a quota from a production subsidy as forms of protection",
            "Outline administrative barriers and other non-tariff barriers to trade",
          ],
          criteria: {
            "Explain the effects of a tariff on consumers, producers and the government": ["a tariff is a tax on imports that raises the domestic price of the imported good", "domestic producers sell more at a higher price while consumers buy less and pay more, so consumer surplus falls", "the government gains tariff revenue and there is a welfare loss from inefficient extra domestic production"],
            "Distinguish a quota from a production subsidy as forms of protection": ["a quota is a physical limit on the quantity of a good that may be imported, raising the domestic price", "a production subsidy is a payment to domestic producers that lowers their costs and shifts domestic supply right", "a subsidy leaves the consumer price unchanged but is a cost to the government, while a quota raises the price paid by consumers"],
            "Outline administrative barriers and other non-tariff barriers to trade": ["regulations, standards and licensing requirements that foreign firms find costly to meet", "customs procedures and paperwork that delay or discourage imports", "they restrict imports without an explicit tax, so they are harder to challenge or measure"],
          },
        },
        {
          id: "u4-3-trade-protection-arguments",
          code: "4.3",
          label: "Arguments for and against trade protection",
          slug: "ib-economics-43-arguments-for-and-against-trade-protection",
          misconceptions: [
            "Protection saves jobs with no cost (jobs are protected in one industry while consumers pay more and export industries may lose from retaliation).",
            "Dumping means selling cheap imports (dumping is selling below cost of production or below the price at home).",
            "Infant industry protection always produces a competitive industry (protected firms may never face enough pressure to become efficient).",
          ],
          objectives: [
            "Outline the main arguments used to justify trade protection",
            "Explain the arguments against trade protection",
            "Outline the role of the WTO in reducing barriers to trade",
          ],
          criteria: {
            "Outline the main arguments used to justify trade protection": ["protecting infant industries until they can achieve economies of scale", "protecting domestic jobs and strategic industries, and national security", "preventing dumping and improving the current account balance, or raising government revenue"],
            "Explain the arguments against trade protection": ["protection raises prices and reduces choice for consumers", "it shields inefficient domestic producers, so resources are misallocated", "it invites retaliation, which harms export industries and can start a trade war"],
            "Outline the role of the WTO in reducing barriers to trade": ["the WTO negotiates multilateral agreements to lower tariffs and other barriers", "it settles trade disputes between member countries", "its influence is limited by the rise of bilateral and regional agreements and by the veto of large members"],
          },
        },
        {
          id: "u4-4-economic-integration",
          code: "4.4",
          label: "Economic integration",
          slug: "ib-economics-44-economic-integration",
          misconceptions: [
            "A customs union and a free trade area are the same (a customs union adds a common external tariff).",
            "A monetary union only means sharing notes and coins (members also give up an independent monetary policy and their own exchange rate).",
            "Economic integration benefits every member equally (trade diversion and loss of policy freedom can leave some members worse off).",
          ],
          objectives: [
            "Distinguish the stages of economic integration",
            "Distinguish trade creation from trade diversion",
            "Evaluate the benefits and costs of joining a monetary union",
          ],
          criteria: {
            "Distinguish the stages of economic integration": ["a free trade area removes tariffs between members but each keeps its own external tariff", "a customs union adds a common external tariff against non-members", "a common market adds free movement of factors of production, and a monetary union adds a single currency and a single central bank"],
            "Distinguish trade creation from trade diversion": ["trade creation is the shift of production to a lower-cost member producer once tariffs are removed", "trade diversion is the shift away from a lower-cost non-member to a higher-cost member because of the common external tariff", "trade creation raises welfare while trade diversion lowers it"],
            "Evaluate the benefits and costs of joining a monetary union": ["benefits include lower transaction costs, no exchange rate risk and greater price transparency", "costs include the loss of an independent monetary policy and of the exchange rate as an adjustment tool", "one common shock can suit some members and not others, so fiscal transfers or labour mobility are needed"],
          },
        },
        {
          id: "u4-5-exchange-rates",
          code: "4.5",
          label: "Exchange rates",
          slug: "ib-economics-45-exchange-rates",
          misconceptions: [
            "A weak currency is always bad for an economy (depreciation makes exports more competitive, though it raises import prices).",
            "Under a floating system the government sets the exchange rate (it is set by demand for and supply of the currency in the foreign exchange market).",
            "Appreciation and revaluation are the same (appreciation happens under a floating rate, revaluation is a deliberate change under a fixed rate).",
          ],
          objectives: [
            "Explain how a floating exchange rate is determined",
            "Outline the causes of appreciation and depreciation of a floating currency",
            "Explain the effects of a depreciation on the economy",
          ],
          criteria: {
            "Explain how a floating exchange rate is determined": ["the exchange rate is the price of one currency in terms of another", "it is set where demand for the currency equals supply in the foreign exchange market", "demand comes from exports, inward investment and speculation; supply comes from imports and outward investment"],
            "Outline the causes of appreciation and depreciation of a floating currency": ["a rise in relative interest rates attracts financial inflows and raises demand for the currency", "a rise in demand for the country's exports or in inward foreign direct investment raises demand for the currency", "higher relative inflation, a rise in imports or speculation against the currency causes depreciation"],
            "Explain the effects of a depreciation on the economy": ["exports become cheaper abroad and imports dearer, so net exports and AD tend to rise", "the current account may improve, provided demand for exports and imports is sufficiently elastic", "import prices rise, so imported inflation and higher costs for firms using imported inputs follow"],
          },
        },
        {
          id: "u4-6-balance-of-payments",
          code: "4.6",
          label: "Balance of payments",
          slug: "ib-economics-46-balance-of-payments",
          misconceptions: [
            "A current account deficit means the country is bankrupt (it means imports of goods and services exceed exports and is financed by the financial account).",
            "The balance of payments can be in deficit overall (it always balances; individual accounts offset each other).",
            "A current account surplus is always good (it can mean weak domestic demand or an overdependence on export markets).",
          ],
          objectives: [
            "Outline the components of the balance of payments",
            "Explain the consequences of a persistent current account deficit",
            "Explain the relationship between the current account and the exchange rate",
          ],
          criteria: {
            "Outline the components of the balance of payments": ["the current account records trade in goods and services, income and current transfers", "the capital account records capital transfers and non-produced non-financial assets", "the financial account records foreign direct investment, portfolio investment and reserve assets", "the accounts must sum to zero, so a current account deficit is matched by a financial account surplus"],
            "Explain the consequences of a persistent current account deficit": ["it must be financed by borrowing or by selling domestic assets to foreigners", "it puts downward pressure on the currency under a floating exchange rate", "rising foreign debt and interest payments can lower future national income and confidence"],
            "Explain the relationship between the current account and the exchange rate": ["a current account deficit means more of the currency is supplied to buy imports than is demanded for exports", "under a floating rate the currency depreciates, which tends to correct the deficit over time", "correction depends on the elasticities of demand for exports and imports, and a J-curve effect may delay it"],
          },
        },
        {
          id: "u4-7-sustainable-development",
          code: "4.7",
          label: "Sustainable development",
          slug: "ib-economics-47-sustainable-development",
          misconceptions: [
            "Sustainable development means stopping economic growth (it means meeting present needs without preventing future generations from meeting theirs).",
            "Sustainability is only an environmental issue (the IB treats it as economic, social and environmental together).",
            "Poor countries pollute most, so they must act alone (responsibility is shared, and rich countries account for most historical emissions).",
          ],
          objectives: [
            "Explain what sustainable development means",
            "Explain the tension between economic growth and environmental sustainability",
            "Outline how the Sustainable Development Goals frame development policy",
          ],
          criteria: {
            "Explain what sustainable development means": ["development that meets the needs of the present without compromising the ability of future generations to meet their own needs", "it combines economic, social and environmental objectives rather than output alone", "it requires that the stock of natural capital is not depleted faster than it can be replaced"],
            "Explain the tension between economic growth and environmental sustainability": ["growth uses non-renewable resources and generates negative externalities such as pollution", "poverty itself can force the overuse of land, forests and fisheries", "the costs of climate change and degradation are borne largely by future generations and by poorer countries"],
            "Outline how the Sustainable Development Goals frame development policy": ["the UN Sustainable Development Goals are a set of agreed global targets covering poverty, health, education, equality and climate", "they treat development as multidimensional rather than as growth in income alone", "progress is monitored with indicators, and the goals require international cooperation and finance"],
          },
        },
        {
          id: "u4-8-measuring-development",
          code: "4.8",
          label: "Measuring development",
          slug: "ib-economics-48-measuring-development",
          misconceptions: [
            "Economic growth and economic development are the same (growth is a rise in real output; development is a broad rise in living standards and opportunity).",
            "A country with high GDP per capita must have a high HDI (health and education outcomes can lag far behind income).",
            "The HDI captures everything that matters in development (it omits inequality, gender, environment and political freedom).",
          ],
          objectives: [
            "Distinguish economic growth from economic development",
            "Explain how the Human Development Index measures development",
            "Outline the limitations of single indicators of development",
          ],
          criteria: {
            "Distinguish economic growth from economic development": ["growth is an increase in real GDP or real GDP per capita over time", "development is a broader rise in living standards, including health, education, freedom and reduced poverty", "growth may occur without development if the gains are captured by a small group"],
            "Explain how the Human Development Index measures development": ["HDI is a composite index combining three dimensions", "its dimensions are health, by life expectancy at birth, education, by years of schooling, and income, by GNI per capita", "each dimension is indexed between 0 and 1 and the three are averaged, so it is multidimensional"],
            "Outline the limitations of single indicators of development": ["GDP per capita ignores distribution, the informal economy and negative externalities", "HDI ignores inequality, gender differences, environmental quality and political freedom", "other indicators, such as the Inequality-adjusted HDI or the Gender Inequality Index, are used alongside it"],
          },
        },
        {
          id: "u4-9-barriers-to-development",
          code: "4.9",
          label: "Barriers to economic growth and development",
          slug: "ib-economics-49-barriers-to-economic-growth-and-economic-development",
          misconceptions: [
            "Poor countries are poor because they lack natural resources (many resource-rich countries remain poor, a pattern called the resource curse).",
            "Foreign aid alone removes barriers to development (weak institutions, debt and poor infrastructure can blunt its effect).",
            "Dependence on primary exports is a safe strategy (commodity prices are volatile and their income elasticity of demand is low).",
          ],
          objectives: [
            "Outline economic barriers to development",
            "Explain how weak institutions and poor governance hold back development",
            "Outline social barriers to economic development",
          ],
          criteria: {
            "Outline economic barriers to development": ["poverty traps where low income leads to low saving, low investment and low income again", "dependence on volatile primary exports and low levels of infrastructure, capital and human capital", "high levels of foreign debt and limited access to international markets and credit"],
            "Explain how weak institutions and poor governance hold back development": ["insecure property rights and weak legal systems discourage investment", "corruption diverts public funds away from health, education and infrastructure", "political instability and conflict destroy capital and deter foreign direct investment"],
            "Outline social barriers to economic development": ["poor health and limited access to clean water, sanitation and health care reduce productivity", "low levels of education and gender inequality waste human capital", "rapid population growth can outpace the growth of output per person"],
          },
        },
        {
          id: "u4-10-development-strategies",
          code: "4.10",
          label: "Economic growth and development strategies",
          slug: "ib-economics-410-economic-growth-and-economic-development-strategies",
          misconceptions: [
            "Foreign aid is always the best route to development (its effect depends on the type of aid, on governance and on whether it creates dependency).",
            "Trade liberalisation benefits every developing country immediately (infant industries and workers in exposed sectors can be harmed).",
            "Microfinance ends poverty on its own (it helps small enterprise but cannot substitute for infrastructure, health and education).",
          ],
          objectives: [
            "Distinguish trade-based strategies from aid-based strategies for development",
            "Explain the role of foreign direct investment in economic development",
            "Outline interventionist and market-based strategies used within developing economies",
          ],
          criteria: {
            "Distinguish trade-based strategies from aid-based strategies for development": ["trade strategies include export promotion, import substitution, liberalisation and diversification away from primary goods", "aid strategies include humanitarian aid, development aid, concessional loans and debt relief", "trade can be self-sustaining but is exposed to world markets, while aid may create dependency or be tied"],
            "Explain the role of foreign direct investment in economic development": ["multinational companies bring capital, technology, skills and access to export markets", "FDI creates employment and raises tax revenue in the host country", "profits may be repatriated, environmental and labour standards may be weak, and domestic firms may be displaced"],
            "Outline interventionist and market-based strategies used within developing economies": ["interventionist measures include investment in infrastructure, education, health and industrial policy", "market-based measures include deregulation, privatisation, liberalised trade and finance, and microfinance", "institutional measures such as secure property rights, anti-corruption reform and access to banking underpin both"],
          },
        },
      ],
    },
  ],
};
