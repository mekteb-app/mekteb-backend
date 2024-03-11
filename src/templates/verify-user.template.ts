export default (name: string, link: string) => `
    <div>Es-selamu alejkum, <strong>${name}</strong>!</div>
    <div style="margin-top: 12px;">Please click the link below to verify your account:</div>
    <div style="margin-top: 12px;">
        <a type="button" style="padding: 4px 8px; background: #017a45; color: white; text-decoration: none; border-radius: 4px;" href="${link}">Verify account</a>
    </div>
    <div style="margin-top: 12px;"><a href="${link}">${link}</a></div>
`;
