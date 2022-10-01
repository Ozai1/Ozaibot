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
        description: '1st option.', //You can change the emoji by putting an emoji at the start like: :thumbsup: yes.
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
    async execute(client, interaction, Discord, userstatus) {
        await interaction.deferReply()
        let choices = populate_array(interaction.options)
        let string = ''
        string += `**${interaction.options.getString('question')}**\n\n`
        let reacts = []
        let displayemoji = undefined
        for (let i = 0; i < choices.length; i++) {
            if (choices[i]) {
                // let characters = choices[i].split("")
                // if (characters[0] === '<' && characters[2] === ':') {
                //     displayemoji = choices[i]
                //     displayemoji.split(">")
                //     displayemoji = `${displayemoji[0]}>`
                //     string = string += choices[i] + "\n"
                //     reacts.push(displayemoji)
                // } else {
                    string += `${intToLetter.get(i)} ${choices[i]}\n`
                    reacts.push(intToLetter.get(i))
                // }
            }
        }
        const pollembed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setDescription(`${string}`)
        const replymessage = await interaction.editReply({ embeds: [pollembed] })

        const filter = (reaction, user) => user.id !== client.user.id;
        const collector = replymessage.createReactionCollector({ filter, time: choices.length * 1000 });
        collector.on('collect', (react, user) => {
            replymessage.reactions.resolve(react.emoji.name).users.remove(user.id);
        });
        reacts.forEach(react => {
            replymessage.react(react).catch(err => {
                console.log("COULD NOT REACT TO POLL \n" + err)
            })
        })
    },
};
//🇦 🇧 🇨 🇩 🇪 🇫 🇬 🇭 🇮 🇯 🇰 🇱 🇲 🇳 🇴 🇵 🇶 🇷 🇸 🇹 🇺 🇻 🇼 🇽 🇾 🇿 ☑️✅❎✖️❌
const intToLetter = new Map()
    .set(0, '🇦')
    .set(1, '🇧')
    .set(2, '🇨')
    .set(3, '🇩')
    .set(4, '🇪')
    .set(5, '🇫')
    .set(6, '🇬')
    .set(7, '🇭')
    .set(8, '🇮')
    .set(9, '🇯')
    .set(10, '🇰')
    .set(11, '🇱')
    .set(12, '🇲')
    .set(13, '🇳')
    .set(14, '🇴')
    .set(15, '🇵')
    .set(16, '🇶')
    .set(17, '🇷')
    .set(18, '🇸')
    .set(19, '🇹')
    .set(20, '🇺')

function populate_array(options) {
    choices = []
    choices.push(options.getString('choice_a'))
    choices.push(options.getString('choice_b'))
    choices.push(options.getString('choice_c'))
    choices.push(options.getString('choice_d'))
    choices.push(options.getString('choice_e'))
    choices.push(options.getString('choice_f'))
    choices.push(options.getString('choice_g'))
    choices.push(options.getString('choice_h'))
    choices.push(options.getString('choice_i'))
    choices.push(options.getString('choice_j'))
    choices.push(options.getString('choice_k'))
    choices.push(options.getString('choice_l'))
    choices.push(options.getString('choice_m'))
    choices.push(options.getString('choice_n'))
    choices.push(options.getString('choice_o'))
    choices.push(options.getString('choice_p'))
    choices.push(options.getString('choice_q'))
    choices.push(options.getString('choice_r'))
    choices.push(options.getString('choice_s'))
    choices.push(options.getString('choice_t'))
    return choices
}