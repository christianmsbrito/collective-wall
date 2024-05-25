class Wall < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  has_many :contributions, dependent: :destroy

  validates :owner, presence: true
  validates :context, presence: true

  def paint_contribution(content, user_id)
    transaction do
      contribution = contributions.build(content: content, user_id: user_id)
      contribution.save!
      contribution
    end
  end

  def finish_painting
    @end_time = Time.now
  end

  def painting_prompt
    context + contributions.pluck(:content).join(' ')
  end
end
