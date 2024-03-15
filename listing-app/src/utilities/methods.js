export function dateStringToDDMMYYYY(dateString) {
    // Parse the date string into a Date object
    const date = new Date(dateString);
  
    // Validate the date object
    if (isNaN(date)) {
      return;
    }
  
    // Extract the day, month, and year from the Date object
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
  
    // Return the formatted string
    return `${day}.${month}.${year}г.`;
  }

  export function filterFalsyValues(array) {
    return Array.from(new Set(array?.filter(item => item) || ['']));
  }
  
  export function calculatePromotionScore(amountPaid) {
    // Get the current date and time
    const currentDate = new Date();

    // Convert the current date to a numeric value (like a timestamp)
    const numericDate = currentDate.getTime();

    // Scale down the numeric date to ensure it adds a small value
    // The scaling factor can be adjusted as needed
    const dateScore = numericDate * 0.000000000001;

    // Add the scaled date score to the amount paid
    const score = amountPaid + dateScore;

    return score;
  }

  export function getRemainingCountOrTen(arrayLength) {
    if (arrayLength === 0) return 0; // If no items, return 0
    const remaining = arrayLength % 10;
    return remaining === 0 ? 10 : remaining;
  }

  export function toggleStringInArray(array, string) {
    const index = array.indexOf(string);
  
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(string);
    }
  
    return Array.from(new Set(array));
  }

  export const EULA = `END USER LICENSE AGREEMENT

  Last updated March 14, 2024
  
  
  
  Searchy is licensed to You (End-User) by Searchy Inc., located and registered at ul.Republika , Sofia, Bulgaria 1000, Bulgaria ("Licensor"), for use only under the terms of this License Agreement.
  
  By downloading the Licensed Application from Apple's software distribution platform ("App Store"), and any update thereto (as permitted by this License Agreement), You indicate that You agree to be bound by all of the terms and conditions of this License Agreement, and that You accept this License Agreement. App Store is referred to in this License Agreement as "Services."
  
  The parties of this License Agreement acknowledge that the Services are not a Party to this License Agreement and are not bound by any provisions or obligations with regard to the Licensed Application, such as warranty, liability, maintenance and support thereof. Searchy Inc., not the Services, is solely responsible for the Licensed Application and the content thereof.
  
  This License Agreement may not provide for usage rules for the Licensed Application that are in conflict with the latest Apple Media Services Terms and Conditions ("Usage Rules"). Searchy Inc. acknowledges that it had the opportunity to review the Usage Rules and this License Agreement is not conflicting with them.
  
  Searchy when purchased or downloaded through the Services, is licensed to You for use only under the terms of this License Agreement. The Licensor reserves all rights not expressly granted to You. Searchy is to be used on devices that operate with Apple's operating systems ("iOS" and "Mac OS").
  
  
  TABLE OF CONTENTS
  
  1. THE APPLICATION
  2. SCOPE OF LICENSE
  3. TECHNICAL REQUIREMENTS
  4. MAINTENANCE AND SUPPORT
  5. USE OF DATA
  6. USER-GENERATED CONTRIBUTIONS
  7. CONTRIBUTION LICENSE
  8. LIABILITY
  9. WARRANTY
  10. PRODUCT CLAIMS
  11. LEGAL COMPLIANCE
  12. CONTACT INFORMATION
  13. TERMINATION
  14. THIRD-PARTY TERMS OF AGREEMENTS AND BENEFICIARY
  15. INTELLECTUAL PROPERTY RIGHTS
  16. APPLICABLE LAW
  17. MISCELLANEOUS
  
  
  1. THE APPLICATION
  
  Searchy ("Licensed Application") is a piece of software created to To allow users to sell their products to each other, follow each other, chat and interact around the process of selling their items — and customized for iOS mobile devices ("Devices"). It is used to To platform users who want to sell their products.
  
  
  2. SCOPE OF LICENSE
  
  2.1  You are given a non-transferable, non-exclusive, non-sublicensable license to install and use the Licensed Application on any Devices that You (End-User) own or control and as permitted by the Usage Rules, with the exception that such Licensed Application may be accessed and used by other accounts associated with You (End-User, The Purchaser) via Family Sharing or volume purchasing.
  
  2.2  This license will also govern any updates of the Licensed Application provided by Licensor that replace, repair, and/or supplement the first Licensed Application, unless a separate license is provided for such update, in which case the terms of that new license will govern.
  
  2.3  You may not share or make the Licensed Application available to third parties (unless to the degree allowed by the Usage Rules, and with Searchy Inc.'s prior written consent), sell, rent, lend, lease or otherwise redistribute the Licensed Application.
  
  2.4  You may not reverse engineer, translate, disassemble, integrate, decompile, remove, modify, combine, create derivative works or updates of, adapt, or attempt to derive the source code of the Licensed Application, or any part thereof (except with Searchy Inc.'s prior written consent).
  
  2.5  You may not copy (excluding when expressly authorized by this license and the Usage Rules) or alter the Licensed Application or portions thereof. You may create and store copies only on devices that You own or control for backup keeping under the terms of this license, the Usage Rules, and any other terms and conditions that apply to the device or software used. You may not remove any intellectual property notices. You acknowledge that no unauthorized third parties may gain access to these copies at any time. If you sell your Devices to a third party, you must remove the Licensed Application from the Devices before doing so.
  
  2.6  Violations of the obligations mentioned above, as well as the attempt of such infringement, may be subject to prosecution and damages.
  
  2.7  Licensor reserves the right to modify the terms and conditions of licensing.
  
  2.8  Nothing in this license should be interpreted to restrict third-party terms. When using the Licensed Application, You must ensure that You comply with applicable third-party terms and conditions.
  
  
  3. TECHNICAL REQUIREMENTS
  
  3.1  The Licensed Application requires a firmware version 1.0.0 or higher. Licensor recommends using the latest version of the firmware.
  
  3.2  Licensor attempts to keep the Licensed Application updated so that it complies with modified/new versions of the firmware and new hardware. You are not granted rights to claim such an update.
  
  3.3  You acknowledge that it is Your responsibility to confirm and determine that the app end-user device on which You intend to use the Licensed Application satisfies the technical specifications mentioned above.
  
  
  4. MAINTENANCE AND SUPPORT
  
  4.1  The Licensor is solely responsible for providing any maintenance and support services for this Licensed Application. You can reach the Licensor at the email address listed in the App Store Overview for this Licensed Application.
  
  4.2  Searchy Inc. and the End-User acknowledge that the Services have no obligation whatsoever to furnish any maintenance and support services with respect to the Licensed Application.
  
  
  5. USE OF DATA
  
  You acknowledge that Licensor will be able to access and adjust Your downloaded Licensed Application content and Your personal information, and that Licensor's use of such material and information is subject to Your legal agreements with Licensor and Licensor's privacy policy: https://www.termsfeed.com/live/8857c84c-8248-4ef0-8fdf-54ec7bb362b2.
  
  You acknowledge that the Licensor may periodically collect and use technical data and related information about your device, system, and application software, and peripherals, offer product support, facilitate the software updates, and for purposes of providing other services to you (if any) related to the Licensed Application. Licensor may also use this information to improve its products or to provide services or technologies to you, as long as it is in a form that does not personally identify you.
  
  
  6. USER-GENERATED CONTRIBUTIONS
  
  The Licensed Application may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or in the Licensed Application, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions"). Contributions may be viewable by other users of the Licensed Application and through third-party websites or applications. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary. When you create or make available any Contributions, you thereby represent and warrant that:
  
  1. The creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party.
  2. You are the creator and owner of or have the necessary licenses, rights, consents, releases, and permissions to use and to authorize us, the Licensed Application, and other users of the Licensed Application to use your Contributions in any manner contemplated by the Licensed Application and this License Agreement.
  3. You have the written consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness or each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Licensed Application and this License Agreement.
  4. Your Contributions are not false, inaccurate, or misleading.
  5. Your Contributions are not unsolicited or unauthorized advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation.
  6. Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libelous, slanderous, or otherwise objectionable (as determined by us).
  7. Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone.
  8. Your Contributions are not used to harass or threaten (in the legal sense of those terms) any other person and to promote violence against a specific person or class of people.
  9. Your Contributions do not violate any applicable law, regulation, or rule.
  10. Your Contributions do not violate the privacy or publicity rights of any third party.
  11. Your Contributions do not violate any applicable law concerning child pornography, or otherwise intended to protect the health or well-being of minors.
  12. Your Contributions do not include any offensive comments that are connected to race, national origin, gender, sexual preference, or physical handicap.
  13. Your Contributions do not otherwise violate, or link to material that violates, any provision of this License Agreement, or any applicable law or regulation.
  
  Any use of the Licensed Application in violation of the foregoing violates this License Agreement and may result in, among other things, termination or suspension of your rights to use the Licensed Application.
  
  
  7. CONTRIBUTION LICENSE
  
  By posting your Contributions to any part of the Licensed Application or making Contributions accessible to the Licensed Application by linking your account from the Licensed Application to any of your social networking accounts, you automatically grant, and you represent and warrant that you have the right to grant, to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license to host, use copy, reproduce, disclose, sell, resell, publish, broad cast, retitle, archive, store, cache, publicly display, reformat, translate, transmit, excerpt (in whole or in part), and distribute such Contributions (including, without limitation, your image and voice) for any purpose, commercial advertising, or otherwise, and to prepare derivative works of, or incorporate in other works, such as Contributions, and grant and authorize sublicenses of the foregoing. The use and distribution may occur in any media formats and through any media channels.
  
  This license will apply to any form, media, or technology now known or hereafter developed, and includes our use of your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names, logos, and personal and commercial images you provide. You waive all moral rights in your Contributions, and you warrant that moral rights have not otherwise been asserted in your Contributions.
  
  We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area in the Licensed Application. You are solely responsible for your Contributions to the Licensed Application and you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action against us regarding your Contributions.
  
  We have the right, in our sole and absolute discretion, (1) to edit, redact, or otherwise change any Contributions; (2) to recategorize any Contributions to place them in more appropriate locations in the Licensed Application; and (3) to prescreen or delete any Contributions at any time and for any reason, without notice. We have no obligation to monitor your Contributions.
  
  
  8. LIABILITY
  
  8.1  Licensor's responsibility in the case of violation of obligations and tort shall be limited to intent and gross negligence. Only in case of a breach of essential contractual duties (cardinal obligations), Licensor shall also be liable in case of slight negligence. In any case, liability shall be limited to the foreseeable, contractually typical damages. The limitation mentioned above does not apply to injuries to life, limb, or health.
  
  8.2  Licensor takes no accountability or responsibility for any damages caused due to a breach of duties according to Section 2 of this License Agreement. To avoid data loss, You are required to make use of backup functions of the Licensed Application to the extent allowed by applicable third-party terms and conditions of use. You are aware that in case of alterations or manipulations of the Licensed Application, You will not have access to the Licensed Application.
  
  
  9. WARRANTY
  
  9.1  Licensor warrants that the Licensed Application is free of spyware, trojan horses, viruses, or any other malware at the time of Your download. Licensor warrants that the Licensed Application works as described in the user documentation.
  
  9.2  No warranty is provided for the Licensed Application that is not executable on the device, that has been unauthorizedly modified, handled inappropriately or culpably, combined or installed with inappropriate hardware or software, used with inappropriate accessories, regardless if by Yourself or by third parties, or if there are any other reasons outside of Searchy Inc.'s sphere of influence that affect the executability of the Licensed Application.
  
  9.3  You are required to inspect the Licensed Application immediately after installing it and notify Searchy Inc. about issues discovered without delay by email provided in Contact Information. The defect report will be taken into consideration and further investigated if it has been emailed within a period of ninety (90) days after discovery.
  
  9.4  If we confirm that the Licensed Application is defective, Searchy Inc. reserves a choice to remedy the situation either by means of solving the defect or substitute delivery.
  
  9.5  In the event of any failure of the Licensed Application to conform to any applicable warranty, You may notify the Services Store Operator, and Your Licensed Application purchase price will be refunded to You. To the maximum extent permitted by applicable law, the Services Store Operator will have no other warranty obligation whatsoever with respect to the Licensed Application, and any other losses, claims, damages, liabilities, expenses, and costs attributable to any negligence to adhere to any warranty.
  
  9.6  If the user is an entrepreneur, any claim based on faults expires after a statutory period of limitation amounting to twelve (12) months after the Licensed Application was made available to the user. The statutory periods of limitation given by law apply for users who are consumers.
     
  
  10. PRODUCT CLAIMS
  
  Searchy Inc. and the End-User acknowledge that Searchy Inc., and not the Services, is responsible for addressing any claims of the End-User or any third party relating to the Licensed Application or the End-User’s possession and/or use of that Licensed Application, including, but not limited to:
  
  (i) product liability claims;
     
  (ii) any claim that the Licensed Application fails to conform to any applicable legal or regulatory requirement; and
  
  (iii) claims arising under consumer protection, privacy, or similar legislation, including in connection with Your Licensed Application’s use of the HealthKit and HomeKit.
  
  
  11. LEGAL COMPLIANCE
  
  You represent and warrant that You are not located in a country that is subject to a US Government embargo, or that has been designated by the US Government as a "terrorist supporting" country; and that You are not listed on any US Government list of prohibited or restricted parties.
  
  
  12. CONTACT INFORMATION
  
  For general inquiries, complaints, questions or claims concerning the Licensed Application, please contact:
         
  Stilyan
  ul.Republika
  Sofia, Bulgaria 1000
  Bulgaria
  searchy2024@gmail.com
  
  
  13. TERMINATION
  
  The license is valid until terminated by Searchy Inc. or by You. Your rights under this license will terminate automatically and without notice from Searchy Inc. if You fail to adhere to any term(s) of this license. Upon License termination, You shall stop all use of the Licensed Application, and destroy all copies, full or partial, of the Licensed Application.
        
  
  14. THIRD-PARTY TERMS OF AGREEMENTS AND BENEFICIARY
  
  Searchy Inc. represents and warrants that Searchy Inc. will comply with applicable third-party terms of agreement when using Licensed Application.
  
  In Accordance with Section 9 of the "Instructions for Minimum Terms of Developer's End-User License Agreement," Apple's subsidiaries shall be third-party beneficiaries of this End User License Agreement and — upon Your acceptance of the terms and conditions of this License Agreement, Apple will have the right (and will be deemed to have accepted the right) to enforce this End User License Agreement against You as a third-party beneficiary thereof.
  
  
  15. INTELLECTUAL PROPERTY RIGHTS
  
  Searchy Inc. and the End-User acknowledge that, in the event of any third-party claim that the Licensed Application or the End-User's possession and use of that Licensed Application infringes on the third party's intellectual property rights, Searchy Inc., and not the Services, will be solely responsible for the investigation, defense, settlement, and discharge or any such intellectual property infringement claims.
  
  
  16. APPLICABLE LAW
  
  This License Agreement is governed by the laws of Bulgaria excluding its conflicts of law rules.
  
  
  17. MISCELLANEOUS
  
  17.1  If any of the terms of this agreement should be or become invalid, the validity of the remaining provisions shall not be affected. Invalid terms will be replaced by valid ones formulated in a way that will achieve the primary purpose.
                 
  17.2  Collateral agreements, changes and amendments are only valid if laid down in writing. The preceding clause can only be waived in writing.
  `