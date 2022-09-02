module.exports = {
    showHelp: false,
    description: "creates a poll",
    name: 'poll',
    options: [{
        name: 'question',
        description: 'name of the poll',
        type: 3,
        required: true
    }, {
        name: 'choice_a',
        description: '1st option. You can change the emoji by putting an emoji at the start like: :thumbsup: yes.',
        type: 3,
        required: false
    }, {
        name: 'choice_b',
        description: '2nd option to be shown.',
        type: 3,
        required: false
    }, {
        name: 'choice_c',
        description: '3rd option to be shown.',
        type: 3,
        required: false
    }, {
        name: 'choice_d',
        description: '4th option to be shown.',
        type: 3,
        required: false
    }, {
        name: 'choice_e',
        description: '5th option to be shown.',
        type: 3,
        required: false
    }, {
        name: 'choice_f',
        description: '6th option to be shown.',
        type: 3,
        required: false
    }, {
        name: 'choice_g',
        description: '7th option to be shown.',
        type: 3,
        required: false
    }, {
        name: 'choice_h',
        description: '8th option to be shown.',
        type: 3,
        required: false
    }, {
        name: 'choice_i',
        description: '9th option to be shown.',
        type: 3,
        required: false
    },
    {
        name: 'choice_j',
        description: '10th option to be shown.',
        type: 3,
        required: false
    },
    {
        name: 'choice_k',
        description: '11th option to be shown.',
        type: 3,
        required: false
    },
    {
        name: 'choice_l',
        description: '12th option to be shown.',
        type: 3,
        required: false
    },
    {
        name: 'choice_m',
        description: '13th option to be shown.',
        type: 3,
        required: false
    },
    {
        name: 'choice_n',
        description: '14th option to be shown.',
        type: 3,
        required: false
    },
    {
        name: 'choice_o',
        description: '15th option to be shown.',
        type: 3,
        required: false
    },
    {
        name: 'choice_p',
        description: '16th option to be shown.',
        type: 3,
        required: false
    },
    {
        name: 'choice_q',
        description: '17th option to be shown.',
        type: 3,
        required: false
    },
    {
        name: 'choice_r',
        description: '18th option to be shown.',
        type: 3,
        required: false
    },
    {
        name: 'choice_s',
        description: '19th option to be shown.',
        type: 3,
        required: false
    },
    {
        name: 'choice_t',
        description: '20th option to be shown..',
        type: 3,
        required: false
    },
    ],
    async execute(client, interaction, Discord, userstatus)  {
        interaction.reply({ content: `I am way to lazy to code this ngl`, ephemeral: true })
        
    },
};